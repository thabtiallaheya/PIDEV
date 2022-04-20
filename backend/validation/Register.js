const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function ValidateRegister(data) {
  let errors = {};

  data.lastName = !isEmpty(data.firstName) ? data.lastName : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "Required firstName";
  }
  if (validator.isEmpty(data.lastName)) {
    errors.firstName = "Required firstName";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Required format email";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Required email";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Required password";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
