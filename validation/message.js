const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.content) ? data.content : "";

  if (!Validator.isLength(data.content, { min: 3, max: 300 })) {
    errors.content = "Post must be between 3 and 300 characters";
  }

  if (Validator.isEmpty(data.content)) {
    errors.content = "text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
