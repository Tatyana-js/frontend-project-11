import i18next from "i18next";
import { validate } from './utils.js';
import watch from './view.js';

export default () => {
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const elements = {
    form: document.querySelector('form'),
  };

  const state = {
    form: {
      status: 'pending', // 'processed',
      errors: [],
      isValid: false,
    },
    uniqueUrls: [],
    posts: [],
    feeds: [],
    ui: {
      activePostsId: null,
      touchedPostId: [],
    },
  };
  const { watchedState, renderForm } = watch(elements, i18n, state);

  renderForm();

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    validate(url, watchedState.uniqueUrls)
      .then((url) => {} )
      .catch(() => {} )

})
}
