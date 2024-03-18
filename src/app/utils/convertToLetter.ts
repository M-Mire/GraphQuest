const convertToLetter = (val: number) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (val > 0) {
    const remainder = (val - 1) % 26;
    result = alphabet[remainder] + result;
    val = Math.floor((val - 1) / 26);
  }
  return result;
};

export default convertToLetter;
