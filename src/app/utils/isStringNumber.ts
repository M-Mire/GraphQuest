const isStringNumber = (string: string) => {
  return /^[0-9]*$/.test(string);
};

export default isStringNumber;
