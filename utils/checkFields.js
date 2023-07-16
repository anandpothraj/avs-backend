const isFieldPresentInRequest = require('./helper');

const checkFields = ( reqBody, requiredFields) => {
    const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: `Error - Missing fields: ${invalidFields.join(", ")}`,
        });
    }
};

module.exports = checkFields;