const specialCharsRegex = /[^\w\s]/;
const containsNumberRegex = /\d+/;

export const validatePassword = (password: string): boolean => {
  return (
    password.length >= 8 && 
    Number.isNaN(+password.charAt(0)) &&
    specialCharsRegex.test(password) &&
    containsNumberRegex.test(password)
  );
};