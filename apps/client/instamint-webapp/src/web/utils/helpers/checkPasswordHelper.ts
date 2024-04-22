import { passwordRegex } from "@instamint/shared-types"

export const checkPasswordHelper = (password: string) => {
  return {
    uppercase: !!password.match(new RegExp(passwordRegex.uppercase)),
    lowercase: !!password.match(new RegExp(passwordRegex.lowercase)),
    number: !!password.match(new RegExp(passwordRegex.number)),
    specialCharacter: !!password.match(
      new RegExp(passwordRegex.specialCharacter)
    ),
    length: password.length >= 8,
  }
}
