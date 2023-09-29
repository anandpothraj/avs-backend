module.exports = (string) => {
    if (typeof string === 'string' && string.toLowerCase() === 'true') {
        return true;
    }
    return false;
}