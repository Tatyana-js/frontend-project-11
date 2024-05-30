import onChange from 'on-change';

export default (elements, i18n, state) => {
  // eslint-disable-next-line no-restricted-globals
  focus();
  const { t } = i18n;

  const renderValid = () => {
  };

  const renderForm = () => {
    Object.entries(elements.staticEl).forEach(([key, value]) => {
      const element = value;
      element.textContent = t(`${key}`);
    });
  };
  const watchedState = onChange(state, (path, value, prevValue) => {
    const { errorElement } = elements;
    switch (path) {
      case 'form.isValid':
        renderValid();
        break;
      case 'form.errors':
        errorElement.classList.remove('text-success');
        errorElement.classList.add('text-danger');
        errorElement.textContent = t('invalidRss');
        break;
      default:
    }
  });
  return {
    watchedState,
    renderForm,
  };
};
