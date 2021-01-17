
export enum ErrorCodes {
    ACCEPTED = 202,
    BAD_GATEWAY = 502,
    BAD_REQUEST = 400,
    CONFLICT = 409,
    CONTINUE = 100,
    CREATED = 201,
    EXPECTATION_FAILED = 417,
    FORBIDDEN = 403,
    GATEWAY_TIMEOUT = 504,
    GONE = 410,
    INTERNAL_SERVER_ERROR = 500,
    LENGTH_REQUIRED = 411,
    LOCKED = 423,
    METHOD_FAILURE = 420,
    METHOD_NOT_ALLOWED = 405,
    NO_CONTENT = 204,
    NOT_ACCEPTABLE = 406,
    NOT_FOUND = 404,
    NOT_IMPLEMENTED = 501,
    NOT_MODIFIED = 304,
    OK = 200,
    REQUEST_TIMEOUT = 408,
    REQUEST_TOO_LONG = 413,
    REQUEST_URI_TOO_LONG = 414,
    SERVICE_UNAVAILABLE = 503,
    TOO_MANY_REQUESTS = 429,
    UNAUTHORIZED = 401,
}

export class ErrorUtil {
    static newError(errorCode: ErrorCodes = ErrorCodes.BAD_REQUEST, info?) {
        if (info) console.error(info);
        if (!(errorCode in ErrorCodes)) errorCode = ErrorCodes.BAD_REQUEST;
        return new Error(errorCode.toString());
    }
}
