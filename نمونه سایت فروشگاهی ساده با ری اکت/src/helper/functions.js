// shorten title
const shorten = (title) => {
  const splittedTitle = title.split(" ");
  if (splittedTitle.length < 2) return title;
  const newTitle = `${splittedTitle[0]} ${splittedTitle[1]}`;
  return newTitle;
};
// check if user added this product to the selected items
const isSelected = (state, id) => {
  const result = !!state.selectedItems.find((item) => item.id === id);
  return result;
};
// checks then number of products that user added
const quantityCount = (state, id) => {
  const index = state.selectedItems.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  } else {
    return state.selectedItems[index].quantity;
  }
};
// translate category to Persian
const categoryLabel = (category) => {
  const map = {
    "men's clothing": "پوشاک مردانه",
    "women's clothing": "پوشاک زنانه",
    jewelery: "جواهرات",
    electronics: "الکترونیک",
  };
  return map[category] || category;
};
export { shorten, isSelected, quantityCount, categoryLabel };
