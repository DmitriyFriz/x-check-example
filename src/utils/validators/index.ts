export const requiredField = <T>(value: T) => {
  if (value) {
    return undefined;
  }
  return 'Field is required!';
};
