const isFieldPresentInRequest = (reqBody, fieldName) => {
  try {
    return (
      reqBody.hasOwnProperty(fieldName) &&
      reqBody[fieldName] !== null &&
      reqBody[fieldName] !== undefined &&
      reqBody[fieldName] !== ""
    );
  } catch (e) {
    console.log(`Error while check field name: ${e}`);
    return false;
  }
}

module.exports = { isFieldPresentInRequest };