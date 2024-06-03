import * as yup from 'yup';

const validate = (url, urlFeeds) => {
  const schema = yup.object({
    url: yup
      .string()
      .url()
      .trim()
      .required()
      .notOneOf(urlFeeds),
  });
  return schema.validate({ url });
};

export const createLink = (url) => {
  const originsUrl = new URL('https://allorigins.hexlet.app/get?');
  originsUrl.searchParams.set('disableCache', 'true');
  originsUrl.searchParams.set('url', url);
  return originsUrl.toString();
};

export default validate;
