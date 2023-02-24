import passwordValidator from 'password-validator';

const schema = new passwordValidator();

schema
  .is().min(6)        // Minimum length 6
  .is().max(20)       // Maximum length 20
  // .has().uppercase()  // Must have uppercase letters
  // .has().lowercase()  // Must have lowercase letters
  // .has().digits()     // Must have digits

export const validatePassword = (password: string) => {
  return schema.validate(password) as boolean
}

export const validateUsername = (username: string) => {
  return /^[a-zA-Z][a-zA-Z\d_]{3,19}$/.test(username) && !/__/.test(username)
};

export const validateName = (name: string) => {
  return name.length <= 255
}