// No model imports needed for error pages

// Define controller function
const testErrorPage = (req, res, next) => {
  const err = new Error('This is a test error');
  err.status = 500;
  next(err);
};


export { testErrorPage };
