import qrcode from "qrcode"

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCode = await qrcode.toDataURL(text)

    return qrCode
  } catch (error) {
    return ""
  }
}
