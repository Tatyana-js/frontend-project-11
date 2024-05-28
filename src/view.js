import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { t } = i18n;

  const watchedState = onChange(state, (path, value) => {
    if (path === 'isValid') {
      /* empty */
    } else if (path === 'errors') {
    // прописать ошибки//
    }
  });
  const renderForm = () => {
    Object.entries(elements).forEach(([key, value]) => {
      const element = value;
      element.textContent = t(`${key}`) ?? '';
    });
  };
  return {
    watchedState,
    renderForm,
  };
};
