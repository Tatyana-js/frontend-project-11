import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { t } = i18n;

  const renderForm = () => {
    // eslint-disable-next-line no-restricted-globals
    focus();
    Object.entries(elements.staticEl).forEach(([key, el]) => {
      const element = el;
      element.textContent = t(`${key}`);
    });
  };
  const renderFeedsAndPosts = () => {

  };

  const watchedState = onChange(state, (path, value) => {
    const { errorElement, input, button } = elements;
    switch (path) {
      case 'form.status':
        if (value === 'pending') {
          renderForm();
        } else if (value === 'invalid') {
          console.log(value);
          input.classList.add('is-invalid');
          errorElement.classList.remove('text-success');
          errorElement.classList.add('text-danger');
          errorElement.textContent = t('errors.invalidUrl');
        }
        renderFeedsAndPosts();
        break;
      case 'loadingProcess.status':
        if (value === 'sending') {
          errorElement.textContent = '';
          input.classList.remove('is-invalid');
          button.disabled = true;
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
