export function generateClinicId() {
    // Get current date and time
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2) // Last 2 digits of year
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")

    // Generate 6 random digits
    const randomDigits = Math.floor(100000 + Math.random() * 900000)

    // Combine all parts as numeric: YYMMDDHHMMSS + 6 random digits
    // Format: YYMMDDHHMMSSXXXXXX (total 18 digits)
    const clinicId = `${year}${month}${day}${hours}${minutes}${seconds}${randomDigits}`

    // Return as a number (BigInt compatible)
    return clinicId
}
