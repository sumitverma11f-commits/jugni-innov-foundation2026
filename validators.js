// Strips HTML tags and trims whitespace from any input value.
// Prevents basic HTML injection through form fields.
function cleanText(value = '') {
  return String(value).trim().replace(/<[^>]*>?/gm, '');
}

// Escapes special HTML characters before inserting user data into email templates.
// Prevents HTML injection inside notification emails sent to the admin.
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validates email format.
// Requires at least one character before @, a domain, and a TLD.
function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
}

// Validates phone number format — optional field.
// Returns true if phone is empty (field is not required).
// Returns true only if format matches digits, spaces, +, -, (, ) between 7–20 chars.
function isPhone(phone) {
  if (!phone) return true;
  return /^[+\d\s()\-]{7,20}$/.test(phone);
}

module.exports = { cleanText, escapeHtml, isEmail, isPhone };
