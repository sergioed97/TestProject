exports.create = (
    success, // boolean
    description, // developer information
    data, // object
    error
) => {
    let response = {
        success: success,
        description: description,
        data: data
    };

    if (!success) {
        if (!error) {
            throw "error object missing for success = false";
        }

        return {
            ...response,
            ...error
        }
    }

    return response;
}

exports.ERRORS = {
    DB_ERROR: { code: "000001", errorMessage: "db_error"},
    AUTH_ERROR: { code: "000002", errorMessage: "auth_error"},
    
    ACCESS_DENIED: { code: "000010", errorMessage: "access_denied"},

    EMAIL_ALREADY_USED: { code: "000100", errorMessage: "email_already_used"},
    PHONE_NUMBER_ALREADY_USED: { code: "000101", errorMessage: "phone_number_already_used"},
    USER_NOT_FOUND: { code: "000102", errorMessage: "user_not_found"},
};