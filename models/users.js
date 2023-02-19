import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const { Schema, model } = mongoose
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide you name"],
        maxLength: 50,
        minLength: 3
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please provide password"],
        minLength: 6
    }

})

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.createJwt = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatched = await bcrypt.compare(candidatePassword, this.password)
    return isMatched

}


export default model('User', UserSchema)