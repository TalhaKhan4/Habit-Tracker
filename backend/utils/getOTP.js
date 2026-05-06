function getOtp() {
  let otp = "";

  for (let i = 1; i <= 6; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    otp += randomNumber;
  }

  return otp;
}

module.exports = getOtp;
