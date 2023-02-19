import { StatusCodes } from "http-status-codes"
import JobSchema from "../models/jobs.js"
import NotFoundError from "../errors/not-found.js"
import BadRequest from "../errors/bad-request.js"
const getAllJobs = async (req, res) => {

    const jobs = await JobSchema.find({ createdBy: req.user.userId }).sort("createdAt")
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getJob = async (req, res) => {
    const { user: { userId }, params: {
        id: jobId
    } } = req
    const job = await JobSchema.findOne({ createdBy: userId, _id: jobId })
    if (!job) {
        throw new NotFoundError(`Not job with an Id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ msg: "success", job })

}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await JobSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }, body: { company, position } } = req
    if (company === "" || position === "") {
        throw new BadRequest("company or position cannot be blank")
    }
    const job = await JobSchema.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })
    if (!job) {
        throw new NotFoundError(`No job with an ID: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await JobSchema.findOneAndRemove({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError(`No job with an ID: ${jobId}`)
    }
    res.status(StatusCodes.OK).json()
}

export { getAllJobs, getJob, createJob, updateJob, deleteJob }
