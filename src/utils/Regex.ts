export const validName = /^[A-Za-z\s'-]+$/; // alphabets, spaces, hyphens only

export const validCardNumber = /^\d{16}$/;

export const validCVV = /^\d{3}$/;

// over 8 characters long with at least 1 number, 1 capital and 1 symbol and no spaces. give me regex
export const validPassword =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])(?!.*\s).{9,}$/;

// not full validator but rejects malformed strings while allowing real-world addresses
export const validEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
