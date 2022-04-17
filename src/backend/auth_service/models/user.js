const mongoose = require("mongoose")
const joi = require("joi")
const jwt = require("jsonwebtoken")
const config = require("config")

const userSchema = new mongoose.Schema({
    email: { minlength: 5, maxlength: 255, required: true, type: String, unique: true },
    // username: { maxlength: 255, required: true, type: String },
    // cookies: { type: String },
    // url: { type: String },
    // host: { type: String },
    password: { minlength: 5, maxlength: 1024, type: String }
})

userSchema.methods.gen_jwt = function() {
    const token = jwt.sign({ email: this.email }, config.get("jwt_key"));
    return token;
}

const User = mongoose.model("User", userSchema)

function validate_signUp(user) {
    const schema = joi.object({
        email: joi.string().min(5).max(255).email().required(),
        password: joi.string().min(5).max(255).required()
    })
    return schema.validate(user);
}

function validate_login(user) {
    const schema = joi.object({
        email: joi.string().min(5).max(255).email().required(),
        password: joi.string().min(5).max(255).required(),
    })
    return schema.validate(user);
}


exports.validate_signUp = validate_signUp;
exports.validate_login = validate_login;
exports.User = User;