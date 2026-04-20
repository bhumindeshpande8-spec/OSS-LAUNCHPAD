export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin(values) {
  const errors = {};
  if (!validateEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Password is required.";
  return errors;
}

export function validateSignup(values) {
  const errors = {};
  if (!values.fullName?.trim()) errors.fullName = "Full name is required.";
  if (!validateEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password || values.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function required(value, message) {
  return value?.trim() ? "" : message;
}
