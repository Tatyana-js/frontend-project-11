export default (data) => {
  const parser = new DOMParser();
  parser.parseFromString(data, 'text/xml');
};
