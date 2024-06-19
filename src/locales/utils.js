import * as yup from 'yup';

yup.setLocale({
  mixed: {
    url: () => ({ key: 'errors.invalidUrl' }),
    notoneOf: () => ({ key: 'errors.existsRss' }),
  },
});

const validate = (url, urlFeeds) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url('errors.invalidUrl')
      .trim()
      .required()
      .notOneOf(urlFeeds, 'errors.existsRss'),
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
