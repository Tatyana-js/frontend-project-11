import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { t } = i18n;
  const renderForm = () => {
    Object.entries(elements.staticEl).forEach(([key, value]) => {
      const element = value;
      element.textContent = t(`${key}`);
    });
  };
  const watchedState = onChange(state, (path) => {
    // eslint-disable-next-line default-case
    switch (path) {
      case 'form.isValid':
    }
  });
  return {
    watchedState,
    renderForm,
  };
};
