import * as yup from 'yup';

const validate = (url, uniqueUrls) => {
  const schema = yup.object({
    url: yup
      .string()
      .trim()
      .required()
      .notOneOf(uniqueUrls, errorMessage),
  });
  return schema.validate({ url });
};
export default validate;
