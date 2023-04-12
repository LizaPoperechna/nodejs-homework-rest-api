const {Schema, model} = require('mongoose');
const {handleMongooseErr} = require('../helpers')
const Joi = require('joi');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
       password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: 6,
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          match: emailRegex,
          unique: true,
          lowercase: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: "",
        },
        avatarURL: {
            type: String,
            required: true,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseErr);
  
const registerSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string(),
});
  
const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required(),
  });

const emailSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

const User = model("user", userSchema);
  
module.exports = {
    User,
    userSchema,
    loginSchema,
    registerSchema,
    emailSchema
}; 