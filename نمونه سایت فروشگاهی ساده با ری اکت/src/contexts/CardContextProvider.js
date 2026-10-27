import React, { useEffect, useReducer } from "react";

const STORAGE_KEY = "shopStore-productslist";

const initialState = {
  selectedItems: [],
  itemsCounter: 0,
  total: 0,
  checkout: false,
};
// count function
const sumItems = (items) => {
  const itemsCounter = items.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const total = items
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);

  return { itemsCounter, total };
};

// load saved card from localStorage (runs once, on mount)
const init = () => {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);
    if (savedItems == null) return initialState;
    const parsedItems = JSON.parse(savedItems);
    if (!parsedItems || !Array.isArray(parsedItems.selectedItems)) {
      return initialState;
    }
    return {
      ...initialState,
      selectedItems: parsedItems.selectedItems,
      ...sumItems(parsedItems.selectedItems),
      checkout: Boolean(parsedItems.checkout),
    };
  } catch (error) {
    console.error("Failed to load card from localStorage:", error);
    return initialState;
  }
};

// Reducer (pure — no state mutation, no side effects)
const cardReducer = (state, action) => {
  switch (action.type) {
    // adding a product for first time
    case "ADD_ITEM": {
      const isExist = state.selectedItems.find(
        (item) => item.id === action.payload.id
      );
      const selectedItems = isExist
        ? state.selectedItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.selectedItems, { ...action.payload, quantity: 1 }];
      return {
        ...state,
        selectedItems,
        checkout: false,
        ...sumItems(selectedItems),
      };
    }
    // remove products (When user selects more than one product and wants to remove a number of them)
    case "REMOVE_ITEM": {
      const selectedItems = state.selectedItems.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        selectedItems,
        checkout: false,
        ...sumItems(selectedItems),
      };
    }
    // add products (when user want to add more than one product)
    case "INCREASE": {
      const selectedItems = state.selectedItems.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return {
        ...state,
        selectedItems,
        ...sumItems(selectedItems),
      };
    }
    // remove products (When user selects more than one product and wants to remove a number of them)
    case "DECREASE": {
      const selectedItems = state.selectedItems
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      return {
        ...state,
        selectedItems,
        ...sumItems(selectedItems),
      };
    }
    case "CHECKOUT":
      return {
        selectedItems: [],
        itemsCounter: 0,
        total: 0,
        checkout: true,
      };
    case "CLEAR":
      return { ...initialState };
    default:
      return state;
  }
};
// context
export const CardContext = React.createContext();

const CardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cardReducer, undefined, init);

  // persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save card to localStorage:", error);
    }
  }, [state]);

  return (
    <CardContext.Provider value={{ state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContextProvider;
