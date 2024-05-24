import onChange from 'on-change';

export default (elements, i18n, state) => {
  const { t } = i18n;

  const watchedState = onChange(state, (path, value) => {

  });
  const renderForm = () => {

  };
  return {
    watchedState,
    renderForm,
  };
};
