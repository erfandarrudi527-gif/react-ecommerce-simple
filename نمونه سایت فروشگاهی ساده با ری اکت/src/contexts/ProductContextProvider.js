import React, { useEffect, useState } from "react";
// API
import { GetAllProducts } from "../services/getAllProducts";
// context
export const ProductContext = React.createContext();

const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const result = await GetAllProducts();
        setProducts(result);
      } catch (error) {
        console.error("Failed to load products:", error);
        setHasError(true);
      }
    };
    fetchAPI();
  }, []);

  return (
    <ProductContext.Provider value={{ products, hasError }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
