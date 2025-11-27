/**
 * Generates a unique clinic ID based on:
 * - 4 random digits
 * - Timestamp (date and time of account creation)
 * - 3 digits from the doctor's phone number
 * This ensures compatibility with BIGINT type in the database
 * @param {string} doctorPhone - The doctor's phone number
 * @returns {string} A unique clinic ID
 */
export function generateClinicId(doctorPhone = '') {
    // Generate 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    // Get timestamp (current date and time in YYYYMMDDHHMMSS format)
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');

    // Extract 3 digits from doctor's phone number (last 3 digits)
    let phoneDigits = '000';
    if (doctorPhone && doctorPhone.length >= 3) {
        phoneDigits = doctorPhone.slice(-3);
    } else if (doctorPhone) {
        // If phone number is shorter than 3 digits, pad with zeros
        phoneDigits = doctorPhone.padStart(3, '0').slice(-3);
    }

    // Combine all parts to create the clinic ID
    const clinicId = randomDigits + timestamp + phoneDigits;

    // Ensure it's within BIGINT range (truncate if necessary)
    // BIGINT can handle up to 18 digits, so we'll limit to 18 digits
    return clinicId.substring(0, 18);
}