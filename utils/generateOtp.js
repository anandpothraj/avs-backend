function generateSixDigitNumber() {
    const min = 100000;
    const max = 999999;
    const randomSixDigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomSixDigitNumber;
}

module.exports = generateSixDigitNumber;