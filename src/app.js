import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import validate, { proxyObj } from './utils.js';
import watch from './view.js';
import resources from './locales/index.js';

const elements = {
  staticEl: {
    title: document.querySelector('h1'),
    subtitle: document.querySelector('.lead'),
    label: document.querySelector('[for="url-input"]'),
    example: document.querySelector('.example'),
    button: document.querySelector('[type="submit"]'),
  },
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  errorElement: document.querySelector('.feedback'),
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

yup.setLocale({
  string: {
    url: () => ({ key: 'errors.invalidUrl' }),
  },
  mixed: {
    notoneOf: () => ({ key: 'errors.existsRss' }),
  },
});

export default () => {
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  }).then(() => {
    const { watchedState, renderForm } = watch(elements, i18n, state);
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
  });
};
