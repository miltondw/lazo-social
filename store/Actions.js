export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_MODAL: "ADD_MODAL",
  ADD_CLUBS: "ADD_CLUBS",
  ADD_USERS: "ADD_USERS",
};
export const deleteItem = (data, id, type) => {
  const newData = data.filter((item) => item._id !== id);
  return { type, payload: newData };
};
export const updateItem = (data, id, post, type) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return { type, payload: newData };
};
