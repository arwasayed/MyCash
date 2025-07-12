// utils/sendResponse.js
const sendResponse = (res, statusCode, status, data, message) => {
  res.status(statusCode).json({ status, data, message });
};

module.exports = sendResponse;