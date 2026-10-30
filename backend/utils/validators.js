export function isValidEmail(email) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

// Makes user text safe to use inside a search pattern
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Keeps only the chosen fields from an object
export function pickFields(source, fieldNames) {
  const result = {};
  for (const fieldName of fieldNames) {
    if (source[fieldName] !== undefined) {
      result[fieldName] = source[fieldName];
    }
  }
  return result;
}
