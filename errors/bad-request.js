import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-error.js";
export default class BadRequest extends CustomApiError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}
