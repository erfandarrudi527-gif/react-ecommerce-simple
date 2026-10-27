// order history stored locally (used by the dashboard)
const ORDERS_KEY = "shopOr" + "ders";

const getOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const addOrder = (order) => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 50)));
};

export { getOrders, addOrder };
