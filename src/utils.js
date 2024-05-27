import * as yup from 'yup';

const validate = (url, urlFeeds) => {
  const schema = yup.object({
    url: yup
      .string()
      .trim()
      .required()
      .notOneOf(urlFeeds, 'Ресурс не содержит валидный RSS'),
  });
  return schema.validate({ url });
};

export const proxyObj = (url) => url;
export default validate;
