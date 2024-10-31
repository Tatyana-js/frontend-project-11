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
    feedContainer.innerHTML = '';
    const blok = renderBlock(t('feedTitle'));
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
    });
    feedContainer.append(blok, lists);
  };

  const renderPosts = () => {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = '';
    const post = renderBlock(t('postsTitle'));
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
      link.setAttribute('target', '_blank');
      link.textContent = title;

      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = t('postsButton');

      li.append(link, button);
      lists.append(li);
    });
    postsContainer.append(post, lists);
  };

  const renderModal = () => {
    const activePost = state.posts.find(({ id }) => id === state.ui.activePostId);
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalLink = document.querySelector('[target="_blank"]');
    const modalBtn = document.querySelector('[data-bs-dismiss="modal"]');

    const { title, description, url } = activePost;
    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLink.textContent = t('modal.modalLink');
    modalBtn.textContent = t('modal.modalBody');
    modalLink.url = url;
  };

  const renderFinishedProcess = () => {
    const { staticEl, input, errorElement } = elements;
    staticEl.button.disabled = false;
    input.classList.remove('is-invalid');
    errorElement.classList.remove('text-danger');
    errorElement.classList.add('text-success');
    errorElement.textContent = t('feedback');
  };

  const renderInvalidRSS = () => {
    const { errorElement } = elements;
    errorElement.classList.remove('text-success');
    errorElement.classList.add('text-danger');
    errorElement.textContent = t('errors.invalidRSS');
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    const {
      errorElement, input, form, staticEl,
    } = elements;
    switch (path) {
      case 'form.status':
        renderForm();
        break;
      case 'form.errors':
        errorElement.classList.remove('text-success');
        errorElement.classList.add('text-danger');
        errorElement.textContent = t(state.form.errors);
        input.classList.add('is-invalid');
        break;
      case 'loadingProcess.status':
        if (value === 'sending') {
          staticEl.button.disabled = true;
          errorElement.textContent = '';
        } else if (value === 'finished') {
          renderFinishedProcess();
          form.reset();
          input.focus();
          renderFeeds();
          renderPosts();
        }
        break;
      case 'loadingProcess.error':
        input.classList.remove('is-invalid');
        if (value === 'networkError') {
          errorElement.textContent = t('errors.networkError');
        }
        if (value === 'invalidRSS') {
          renderInvalidRSS();
        }
        break;
      case 'posts':
        if (value.length !== previousValue.length) {
          renderPosts();
        }
        break;
      case 'feeds':
        if (value) {
          renderFeeds();
          form.reset();
          input.focus();
        }
        break;
      case 'ui.touchedPostId':
        state.ui.touchedPostId.forEach((postId) => {
          const post = document.getElementById(postId);
          if (!post.classList.contains('fw-normal')) {
            post.classList.remove('fw-bold');
            post.classList.add('fw-normal', 'link-secondary');
          }
        });
        break;
      case 'ui.activePostId':
        renderModal();
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
