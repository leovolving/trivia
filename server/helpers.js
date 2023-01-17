const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateCode = () => {
  let code = "";
  while (code.length < 4) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
};

module.exports = { generateCode };
