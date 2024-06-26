import i18next from 'i18next';
import 'bootstrap';
import axios from 'axios';
import _ from 'lodash';
import validate, { createLink } from '../utils.js';
import watch from './view.js';
import ru from './locales/ru.js';
import parse from './parser.js';

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
  postsContainer: document.querySelector('.posts'),
};

const state = {
  form: {
    status: 'pending',
    errors: '', //  'invalidUrl', 'existsRss'
  },
  loadingProcess: {
    status: 'sending', // 'finished'
    error: '', // 'networkError', 'invalidRSS'
  },
  posts: [],
  feeds: [],
  ui: {
    activePostId: '',
    touchedPostId: new Set(),
  },
};

const timeout = 5000;

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

    const getUpdateContent = (feeds) => {
      const promises = feeds.map(({ url }) => axios.get(createLink(url))
        .then((responce) => {
          const parseData = parse(responce.data.contents);
          const { posts } = parseData;
          const existPostsTitle = new Set(watchedState.posts.map((post) => post.title));
          const newPosts = posts.filter((post) => !_.has(existPostsTitle, post.title));
          const updatePosts = newPosts.map((post) => ({ ...post, id: _.uniqueId() }));
          watchedState.posts = [...updatePosts, ...watchedState.posts];
        })
        .catch((e) => {
          throw e;
        }));

      Promise.all(promises)
        .finally(() => {
          setTimeout(() => getUpdateContent(watchedState.feeds), timeout);
        });
    };
    getUpdateContent(watchedState.feeds);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const urlTarget = formData.get('url').trim();
      const urlFeeds = watchedState.feeds.map(({ url }) => url);

      watchedState.loadingProcess.status = 'sending';

      validate(urlTarget, urlFeeds)
        .then(({ url }) => axios.get(createLink(url)))
        .then((responce) => {
          const parseData = parse(responce.data.contents);
          const { feed, posts } = parseData;
          watchedState.feeds.push({ ...feed, feedId: _.uniqueId(), url: urlTarget });
          posts.forEach((post) => watchedState.posts.push({ ...post, id: _.uniqueId() }));
          watchedState.loadingProcess.status = 'finished';
          watchedState.loadingProcess.error = '';
        })
        .catch((error) => {
          if (error.isAxiosError) {
            watchedState.loadingProcess.error = 'networkError';
          } else if (error.message === 'invalidRSS') {
            watchedState.loadingProcess.error = 'invalidRSS';
          } else {
            watchedState.form.errors = error.message;
          }
        });
    });

    elements.postsContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        watchedState.ui.touchedPostId.add(e.target.id);
      }
      if (e.target.tagName === 'BUTTON') {
        watchedState.ui.touchedPostId.add(e.target.dataset.id);
        watchedState.ui.activePostId = e.target.dataset.id;
      }
    });
  });
};
