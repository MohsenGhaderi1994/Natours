const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const bcryptHashPower = 12;
const randomTokenSize = 32;
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name!']
    },
    email: {
        type: String,
        required: [true, 'User must have an email!'],
        validate: [validator.isEmail, 'Email is not valid!'],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'guide', 'lead-guide'],
            message: 'Invalid role for user!'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is not provided!'],
        minlength: 8,
        select: false
    },
    PasswordConfirm: {
        type: String,
        required: [true, 'Password confrimation must be provided!'],
        //Custom validation only works on Save and Create!
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: 'password is different from confirmation password'
        }
    },
    photo: {
        type: String
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
    //we use this validation in case password is modified!
    //Confirmation password is not persisted in DB
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, bcryptHashPower);
        this.PasswordConfirm = undefined;
    }
    next();
});

userSchema.methods.correctPassword = async function (
    inputPassword,
    dbPassword
) {
    return await bcrypt.compare(inputPassword, dbPassword);
};

userSchema.methods.changedPasswordAfterLogin = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(randomTokenSize).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
