// Includes crypto module
const crypto = window.require("crypto");

const algorithm = "aes-192-cbc";
const password = "Password used to generate key";
// Use the async `crypto.scrypt()` instead.
const key = crypto.scryptSync(password, "salt", 24);
// Use `crypto.randomBytes` to generate a random iv instead of the static iv
// shown here.
const iv = Buffer.alloc(16, 0); //

// An encrypt function
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text);
  encrypted += cipher.final("hex");
  return encrypted;
}

// A decrypt function
function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Encrypts output
// var output = encrypt("GeeksforGeeks");
// console.log(output);

// Decrypts output
// console.log(decrypt(output));

module.exports = {
  encrypt,
  decrypt,
};
