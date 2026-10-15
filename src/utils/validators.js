export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const mobilePattern = /^[0-9]{10}$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (!passwordPattern.test(password)) {
    return "Use 8+ chars with uppercase, lowercase, number, and special character";
  }
  return "";
}
