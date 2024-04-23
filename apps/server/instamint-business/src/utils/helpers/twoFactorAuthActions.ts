import { authenticator, hotp, totp } from "otplib"

export const generateSecret = () => {
  return authenticator.generateSecret()
}

// For TOTP
export const generateTotpCode = (secret: string) => {
  return totp.generate(secret)
}

// This only checks if the code is valid
export const checkTotpCode = (secret: string, code: string) => {
  return totp.check(code, secret)
}

// This one's better, it checks if the code is valid and also checks if the code is within the time window (TOTP)
export const verifyTotpCode = (secret: string, code: string) => {
  return totp.verify({ secret, token: code })
}

export const generateTotpURI = (
  secret: string,
  email: string,
  issuer: string
) => {
  return totp.keyuri(email, issuer, secret)
}

// For HOTP
export const generateHotpCode = (secret: string, counter: number) => {
  return hotp.generate(secret, counter)
}

export const checkHotpCode = (
  secret: string,
  code: string,
  counter: number
) => {
  return hotp.check(code, secret, counter)
}

export const verifyHotpCode = (
  token: string,
  secret: string,
  counter: number
) => {
  return hotp.verify({ token, secret, counter })
}

export const generateHotpURI = (
  secret: string,
  email: string,
  issuer: string,
  counter: number
) => {
  return hotp.keyuri(email, issuer, secret, counter)
}
