import i18next from "i18next";
import * as yup from 'yup';
import validate, { proxyObj } from './utils.js';
import watch from './view.js';
import axios from 'axios';
import resources from './locales/ru.js';

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
    loadingProcess: {
      status: 'waiting',
      error: '',
    },
    posts: [],
    feeds: [],
    ui: {
      activePostsId: null,
      touchedPostId: [],
    },
  };
  const { watchedState, renderForm } = watch(elements, i18n, state);

  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.invalidRss' }),
    },
    mixed: {
      required: () => ({ key: 'errors.required' }),
      notoneOf: () => ({ key: 'errors.existsRss' }),
    },
  });

  renderForm();

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urlTarget = formData.get('url').trim();
    const urlFeeds = watchedState.feeds.map(({ url }) => url);

    watchedState.loadingProcess.state = 'sending';

    validate(urlTarget, urlFeeds)
      .then(({ url }) => axios.get(proxyObj(url)))
      .catch(() => {});
  });
};
