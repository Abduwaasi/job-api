import CustomApiError from "../errors/custom-error.js";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, please try again later"
    }
    if (err?.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err["keyValue"])} field, please use another email`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if (err?.name === "ValidationError") {
        customError.msg = `User validation failed, ${Object.values(err.errors).map(item => item.message).join(",")}`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if (err?.name === "CastError") {
        customError.msg = `No user with an ID: ${err["value"]} found`
        customError.statusCode = StatusCodes.NOT_FOUND
    }
    // if (err instanceof CustomApiError) {
    //     return res.status(err.StatusCode).json({ msg: err.message })
    // }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    return res.status(customError.statusCode).json({ err: customError.msg })
}

export default errorHandlerMiddleware