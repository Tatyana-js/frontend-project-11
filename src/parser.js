export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  console.log(doc);
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('parsererror');
  }
  const feedTitle = doc.querySelector('channel > title').textContent;
  console.log(feedTitle);
  const feedDescription = doc.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription };
  console.log(feed);
  const items = doc.querySelectorAll('items');
  const posts = Array.from(items).map((post) => {
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    return { title, description };
  });
  console.log(feed, posts);
  return { feed, posts };
};
