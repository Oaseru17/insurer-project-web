// Types the separators for the customer: "03121994" → "03/12/1994" for MM/DD/YYYY.
function maskDate(input: string, format: string): string {
  const digits = input.replace(/\D/g, '');
  let out = '';
  let index = 0;
  for (const char of format) {
    if (index >= digits.length) break;
    if (/[A-Za-z]/.test(char)) out += digits[index++];
    else out += char;
  }
  return out;
}

export { maskDate };
