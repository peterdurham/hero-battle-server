const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSuggestionsInput(data) {
  let errors = {};

  data.category = !isEmpty(data.category) ? data.category : "";
  data.heroName = !isEmpty(data.heroName) ? data.heroName : "";

  if (!Validator.isLength(data.heroName, { min: 3, max: 20 })) {
    errors.heroName = "Hero Name needs to be between 3 and 20 characters";
  }
  if (Validator.isEmpty(data.heroName)) {
    errors.heroName = "Hero Name is required";
  }
  if (Validator.isEmpty(data.category)) {
    errors.category = "Category field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
