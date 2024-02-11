// errorHandler.js

function errorHandler(err, req, res, next) {
    // Определяем код ошибки
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    // Отправляем статус ошибки и сообщение клиенту
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  }
  
  module.exports = errorHandler;
  