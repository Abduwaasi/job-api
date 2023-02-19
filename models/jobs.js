import mongoose from "mongoose";
const { model, Schema, Types } = mongoose

const JobSchema = new Schema({
    company: {
        type: String,
        required: [true, "Please provide company's name"],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, "Please provide the position you are applying for"],
        maxLength: 150
    },
    status: {
        type: String,
        enum: ["Interviewed", "Declined", "Pending"],
        default: "Pending"
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "please provide user Id"]
    }
}, { timestamps: true })

export default model("Job", JobSchema)