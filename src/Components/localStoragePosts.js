export const getStoredArray = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

//This is a LIKE / UNLIKE toggle logic.
export const toggleIdInStorage = (key, postId) => {
  let arr = getStoredArray(key);

  if (arr.includes(postId)) {
    arr = arr.filter(id => id !== postId);
  } else {
    arr.push(postId);
  }

  localStorage.setItem(key, JSON.stringify(arr));
  return arr;
};

//Checks if a post is already liked/saved/reposted.
export const isIdStored = (key, postId) => {
  const arr = getStoredArray(key);
  return arr.includes(postId);
};
