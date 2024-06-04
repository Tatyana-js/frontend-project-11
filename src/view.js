import onChange from 'on-change';

export default (elements, i18n, state) => {
  // eslint-disable-next-line no-restricted-globals
  focus();
  const { t } = i18n;

  const renderForm = () => {
    Object.entries(elements.staticEl).forEach(([key, value]) => {
      const element = value;
      element.textContent = t(`${key}`);
    });
  };
  const watchedState = onChange(state, (path, value) => {
    const { errorElement, input, button } = elements;
    switch (path) {
      case 'pending':
        renderForm();
        break;
      case 'form.errors':
        input.classList.add('is-invalid');
        errorElement.classList.remove('text-success');
        errorElement.classList.add('text-danger');
        errorElement.textContent = t('errors.invalidUrl');
        break;
      case 'loadingProcess.status':
        if (value === 'sending') {
          button.disabled = true;
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
