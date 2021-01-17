"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorUtil = exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["ACCEPTED"] = 202] = "ACCEPTED";
    ErrorCodes[ErrorCodes["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    ErrorCodes[ErrorCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorCodes[ErrorCodes["CONFLICT"] = 409] = "CONFLICT";
    ErrorCodes[ErrorCodes["CONTINUE"] = 100] = "CONTINUE";
    ErrorCodes[ErrorCodes["CREATED"] = 201] = "CREATED";
    ErrorCodes[ErrorCodes["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    ErrorCodes[ErrorCodes["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    ErrorCodes[ErrorCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorCodes[ErrorCodes["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    ErrorCodes[ErrorCodes["GONE"] = 410] = "GONE";
    ErrorCodes[ErrorCodes["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    ErrorCodes[ErrorCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ErrorCodes[ErrorCodes["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    ErrorCodes[ErrorCodes["LOCKED"] = 423] = "LOCKED";
    ErrorCodes[ErrorCodes["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
    ErrorCodes[ErrorCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    ErrorCodes[ErrorCodes["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    ErrorCodes[ErrorCodes["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
    ErrorCodes[ErrorCodes["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    ErrorCodes[ErrorCodes["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    ErrorCodes[ErrorCodes["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
    ErrorCodes[ErrorCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    ErrorCodes[ErrorCodes["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    ErrorCodes[ErrorCodes["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    ErrorCodes[ErrorCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCodes[ErrorCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    ErrorCodes[ErrorCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    ErrorCodes[ErrorCodes["OK"] = 200] = "OK";
    ErrorCodes[ErrorCodes["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    ErrorCodes[ErrorCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    ErrorCodes[ErrorCodes["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    ErrorCodes[ErrorCodes["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    ErrorCodes[ErrorCodes["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    ErrorCodes[ErrorCodes["PROCESSING"] = 102] = "PROCESSING";
    ErrorCodes[ErrorCodes["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    ErrorCodes[ErrorCodes["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    ErrorCodes[ErrorCodes["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    ErrorCodes[ErrorCodes["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
    ErrorCodes[ErrorCodes["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    ErrorCodes[ErrorCodes["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    ErrorCodes[ErrorCodes["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    ErrorCodes[ErrorCodes["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    ErrorCodes[ErrorCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    ErrorCodes[ErrorCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
class ErrorUtil {
    static newError(errorCode = ErrorCodes.BAD_REQUEST, info) {
        if (info)
            console.error(info);
        if (!(errorCode in ErrorCodes))
            errorCode = ErrorCodes.BAD_REQUEST;
        return new Error(errorCode.toString());
    }
}
exports.ErrorUtil = ErrorUtil;
//# sourceMappingURL=errorCodes.js.map