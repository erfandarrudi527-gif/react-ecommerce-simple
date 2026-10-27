import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
// icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
// Components
import Card from "./Card";
// helpers
import { addOrder } from "../helper/orders";

// Context
import { CardContext } from "../contexts/CardContextProvider";

const ShopCard = () => {
  const { state, dispatch } = useContext(CardContext);

  useEffect(() => {
    if (state.checkout) {
      swal({
        text: "پرداخت با موفقیت انجام شد",
        icon: "success",
      });
    }
  }, [state.checkout]);

  const handleCheckout = () => {
    // record the order for the dashboard before clearing the cart
    addOrder({
      id: Date.now(),
      date: Date.now(),
      total: state.total,
      items: state.selectedItems.map((i) => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        category: i.category,
      })),
    });
    dispatch({ type: "CHECKOUT" });
  };

  return (
    <Box component="div" className="shopCard-container">
      <Box component="div" className="checkout-container">
        {state.itemsCounter > 0 && (
          <Box component="div" className="total-container animate-in">
            <Box component="div" p={3}>
              <Box component="div" display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  مجموع آیتم ها:
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  {state.itemsCounter}
                </Typography>
              </Box>

              <Box component="div" display="flex" justifyContent="space-between">
                <Typography variant="body1" fontWeight={700} color="primary">
                  مجموع صورت حساب:
                </Typography>
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  {state.total}
                  <span style={{ fontSize: "0.85rem", color: "#8b8a9e" }}> تومان</span>
                </Typography>
              </Box>

              <Box
                component="div"
                className="btn-container"
                sx={{ justifyContent: "space-between", gap: 1 }}
              >
                <Button
                  className="checkout-btn"
                  variant="contained"
                  onClick={handleCheckout}
                >
                  پرداخت
                </Button>
                <Button
                  className="clear-btn"
                  variant="text"
                  onClick={() => dispatch({ type: "CLEAR" })}
                >
                  پاک کردن
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {state.checkout && (
        <Box component="div" className="checkout-card animate-in">
          <CheckCircleIcon sx={{ fontSize: 90, color: "#10b981" }} />
          <Typography variant="h4" color="primary" fontWeight={800} mt={2}>
            پرداخت با موفقیت انجام شد
          </Typography>
          <Box display="flex" gap={2} mt={1}>
            <Link to="/products">بازگشت به فروشگاه</Link>
            <Link to="/dashboard">مشاهده داشبورد</Link>
          </Box>
        </Box>
      )}

      {!state.checkout && state.itemsCounter === 0 && (
        <Box component="div" className="empty-card animate-in">
          <ShoppingCartOutlinedIcon sx={{ fontSize: 90, color: "#a78bfa" }} />
          <Typography variant="h4" color="text.primary" fontWeight={800} mt={2}>
            سبد خرید شما خالی است
          </Typography>
          <Link to="/products">بازگشت به فروشگاه</Link>
        </Box>
      )}

      <Box component="div">
        {state.selectedItems.map((item, index) => (
          <div
            key={item.id}
            className="animate-in"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <Card data={item} />
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default ShopCard;
