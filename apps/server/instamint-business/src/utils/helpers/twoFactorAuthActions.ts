import { authenticator, hotp, totp } from "otplib"
import crypto from "crypto"

export const generateSecret = () => {
  return authenticator.generateSecret()
}

// For Authenticator
export const generateAuthenticatorToken = (secret: string) => {
  return authenticator.generate(secret)
}

export const checkAuthenticatorToken = (token: string, secret: string) => {
  return authenticator.check(token, secret)
}

export const verifyAuthenticatorToken = (token: string, secret: string) => {
  return authenticator.verify({ token, secret })
}

export const generateAuthenticatorURI = (
  email: string,
  issuer: string,
  secret: string
) => {
  return authenticator.keyuri(email, issuer, secret)
}

// For TOTP
export const generateTotpToken = (secret: string) => {
  return totp.generate(secret)
}

// This only checks if the code is valid
export const checkTotpToken = (token: string, secret: string) => {
  return totp.check(token, secret)
}

// This one's better, it checks if the code is valid and also checks if the code is within the time window (TOTP)
export const verifyTotpToken = (token: string, secret: string) => {
  return totp.verify({ token, secret })
}

export const generateTotpURI = (
  email: string,
  issuer: string,
  secret: string
) => {
  return totp.keyuri(email, issuer, secret)
}

// For HOTP
export const generateHotpToken = (secret: string, counter: number) => {
  return hotp.generate(secret, counter)
}

export const checkHotpToken = (
  token: string,
  secret: string,
  counter: number
) => {
  return hotp.check(token, secret, counter)
}

export const verifyHotpToken = (
  token: string,
  secret: string,
  counter: number
) => {
  return hotp.verify({ token, secret, counter })
}

export const generateHotpURI = (
  email: string,
  issuer: string,
  secret: string,
  counter: number
) => {
  return hotp.keyuri(email, issuer, secret, counter)
}

export const generateBackupCodes = (): string[] => {
  const codes: string[] = []

  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charsetLength = charset.length

  for (let y = 0; y < 6; y++) {
    let code = ""
    for (let i = 0; i < 25; i++) {
      const randomIndex = crypto.randomInt(0, charsetLength)
      code += charset.charAt(randomIndex)
    }

    codes.push(code)
  }

  return codes
}
