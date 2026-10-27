import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// context
import ProductContextProvider from "./contexts/ProductContextProvider";
import CardContextProvider from "./contexts/CardContextProvider";
import { AuthProvider } from "./contexts/AuthContextProvider";
// components
import Store from "./components/Store";
import DetailsPage from "./components/DetailsPage";
import ShopCard from "./components/ShopCard";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Contact from "./components/Contact";
import Deals from "./components/Deals";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/Layout";

const App = () => {
  return (
    <AuthProvider>
      <ProductContextProvider>
        <CardContextProvider>
          <Layout>
            <Routes>
              <Route path="/products" element={<Store />} />
              <Route path="/products/:id" element={<DetailsPage />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/deals" element={<Deals />} />
              <Route
                path="/cards"
                element={
                  <ProtectedRoute>
                    <ShopCard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/*" element={<Navigate to="/products" />} />
            </Routes>
          </Layout>
        </CardContextProvider>
      </ProductContextProvider>
    </AuthProvider>
  );
};

export default App;
