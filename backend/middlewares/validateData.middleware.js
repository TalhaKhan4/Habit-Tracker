function validateData(dataSchema) {
  return (req, res, next) => {
    try {
      // console.log("data validation middleware =", req.body);

      const validatedData = dataSchema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      console.log("error = ", error);
      const errorsObject = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errorsObject[field]) {
          errorsObject[field] = issue.message; // Keep first error only
        }
      });

      return res.status(400).json({
        success: false,
        message: "Invalid Input",
        errors: errorsObject,
      });
    }
  };
}

module.exports = validateData;
