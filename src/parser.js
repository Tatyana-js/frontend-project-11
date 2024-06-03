export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('parsererror');
  }
  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription };

  const posts = doc.querySelectorAll('items');
  Array.from(posts).forEach((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    return { title: postTitle, description: postDescription, link: postLink };
  });
  return { feed, posts };
};
