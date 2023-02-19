import CustomApiError from "./custom-error.js";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends CustomApiError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}