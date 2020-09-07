export const requiredField = <T>(value: T) => {
  let error = '';
  if (!value) {
    error = 'Field is required!';
  }
  return error;
};
