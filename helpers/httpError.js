const errorMessageList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict"
}

const HttpError = (status, msg = errorMessageList[status]) => {
    const err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = HttpError;