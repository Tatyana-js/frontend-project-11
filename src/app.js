import i18next from 'i18next';
import 'bootstrap';
import * as yup from 'yup';
import axios from 'axios';
import validate, { createLink } from './utils.js';
import watch from './view.js';
import ru from './locales/ru.js';
import parse from './parser.js';
import { uniqueId } from 'lodash';

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
    status: 'waiting', // 'sending', 'finished'
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
    resources: { ru },
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
        .then(({ url }) => axios.get(createLink(url))
          .then((responce) => {
            const parseData = parse(responce.data);
            const { feed, posts } = parseData;
            const id = uniqueId();
            watchedState.feeds.push({ ...feed, id });
            posts.forEach((post) => watchedState.posts.push({ ...post, id }));
            watchedState.form.isValid = true;
            watchedState.loadingProcess.status = 'finished';
          })
          .catch())
        .catch((error) => {
          watchedState.form.isValid = false;
          watchedState.form.errors.push(error);
        });
    });
  });
};
