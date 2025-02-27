// errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log the error stack to the console
    console.error('Error stack:', err.stack);
  
    // Check if the error has a specific status code for client errors
    if (err.status === 400) {
      console.error('Login Error:', err.stack); // Log the error as a login error for easier debugging
      return res.status(400).json({
        message: err.message || 'Bad Request',
      });
    }
  
    // Handle other errors (e.g., server issues)
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = errorHandler;
  