// export const deepCopy = (obj: any): any => {
//   if (obj === null || typeof obj !== "object") {
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     return obj.map(deepCopy);
//   }

//   return Object.fromEntries(
//     Object.entries(obj).map(([key, value]) => [key, deepCopy(value)]),
//   );
// };

//Had to remove because too many eslint errors 💀
