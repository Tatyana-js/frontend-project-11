export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const error = new Error('invalidRSS');
    throw error;
  }
  const feedTitle = doc.querySelector('channel > title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription };
  const items = doc.querySelectorAll('items');
  const posts = Array.from(items).map((post) => {
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    return { title, description };
  });
  return { feed, posts };
};
