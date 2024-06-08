import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { t } = i18n;

  const renderForm = () => {
    const { input } = elements;
    input.focus();
    Object.entries(elements.staticEl).forEach(([key, el]) => {
      const element = el;
      element.textContent = t(`${key}`);
    });
  };
  const renderBlock = (title) => {
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const cardTitle = document.createElement('h2');

    card.classList.add('card', 'border-0');
    cardBody.classList.add('card-body');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = title;

    card.append(cardBody);
    cardBody.append(cardTitle);
    return card;
  };

  const renderFeeds = () => {
    const feedContainer = document.querySelector('.feeds');
    const cardFeed = renderBlock(t('feedTitle'));
    const lists = document.createElement('ul');
    lists.classList.add('list-group', 'border-0', 'rounded-0');

    state.feeds.forEach(({ title, description }) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      h3.classList.add('h6', 'm-0');
      p.classList.add('m-0', 'small', 'text-black-50');
      h3.textContent = title;
      p.textContent = description;

      li.append(h3, p);
      lists.append(li);
      cardFeed.append(lists);
      feedContainer.append(cardFeed);
    });
  };

  const renderPosts = () => {
    const postsContainer = document.querySelector('.posts');
    const cardPosts = renderBlock(t('postsTitle'));
    const lists = document.createElement('ul');
    lists.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach(({ title, id, url }) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      const button = document.createElement('button');
      li.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
      link.classList.add('fw-bold');
      link.setAttribute('href', url);
      link.setAttribute('id', id);
      link.textContent = title;

      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.textContent = t('postsButton');

      li.append(link, button);
      lists.append(li);
      cardPosts.append(lists);
      postsContainer.append(cardPosts);
    });
  };

  const watchedState = onChange(state, (path, value) => {
    const {
      errorElement, input, form, staticEl,
    } = elements;
    switch (path) {
      case 'form.status':
        if (value === 'pending') {
          renderForm();
        } else if (value === 'invalid') {
          input.classList.add('is-invalid');
          errorElement.classList.remove('text-success');
          errorElement.classList.add('text-danger');
          errorElement.textContent = t('errors.invalidUrl');
        }
        break;
      case 'loadingProcess.status':
        if (value === 'sending') {
          staticEl.button.disabled = true;
          errorElement.textContent = '';
        } else if (value === 'finished') {
          staticEl.button.disabled = false;
          input.classList.remove('is-invalid');
          errorElement.classList.remove('text-danger');
          errorElement.classList.add('text-success');
          errorElement.textContent = t('feedback');
          form.reset();
          input.focus();
          renderFeeds();
          renderPosts();
        }
        break;
      case 'loadingProcess.error':
        if (value === 'networkError') {
          input.classList.remove('is-invalid');
          errorElement.textContent = t('errors.networkError');
        }
        if (value === 'invalidRSS') {
          errorElement.classList.remove('text-success');
          errorElement.classList.add('text-danger');
          errorElement.textContent = t('errors.invalidRSS');
        }
        if (value === 'existsRss') {
          input.classList.add('is-invalid');
          errorElement.classList.add('text-danger');
          errorElement.textContent = t('errors.existsRss');
        }
        break;
      default:
        break;
    }
  });
  return {
    watchedState,
    renderForm,
  };
};
