import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Chip,
  IconButton,
  Card,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// context
import { CardContext } from "../../contexts/CardContextProvider";
// functions
import { isSelected, quantityCount, categoryLabel } from "../../helper/functions";

const Products = ({ productData }) => {
  const { state, dispatch } = useContext(CardContext);

  return (
    <Card className="product-card">
      <Box className="product-card__media">
        <Link to={`/products/${productData.id}`}>
          <img
            src={productData.image}
            alt={productData.title}
            loading="lazy"
          />
        </Link>
        <span className="product-card__badge">
          {categoryLabel(productData.category)}
        </span>
      </Box>

      <Box className="product-card__content">
        <Link to={`/products/${productData.id}`} style={{ textDecoration: "none" }}>
          <Typography className="product-card__title">
            {productData.title}
          </Typography>
        </Link>

        <Box className="product-card__footer">
          <Typography className="product-card__price">
            {productData.price}
            <span className="product-card__price-unit"> تومان</span>
          </Typography>
        </Box>
      </Box>

      <CardActions className="product-card__actions">
        {isSelected(state, productData.id) ? (
          <Box className="qty-controls">
            {quantityCount(state, productData.id) > 1 ? (
              <IconButton
                className="qty-btn"
                onClick={() => dispatch({ type: "DECREASE", payload: productData })}
                aria-label="کاهش تعداد"
                size="medium"
              >
                <RemoveCircleIcon fontSize="medium" color="primary" />
              </IconButton>
            ) : (
              <IconButton
                className="qty-btn"
                onClick={() => dispatch({ type: "REMOVE_ITEM", payload: productData })}
                color="error"
                aria-label="حذف از سبد"
                size="medium"
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            )}
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              className="qty-count"
              label={quantityCount(state, productData.id)}
            />
            <IconButton
              className="qty-btn"
              aria-label="افزایش تعداد"
              size="medium"
              onClick={() => dispatch({ type: "INCREASE", payload: productData })}
            >
              <AddCircleIcon fontSize="medium" color="primary" />
            </IconButton>
          </Box>
        ) : (
          <Button
            className="add-btn"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("ADD_ITEM clicked", productData.id);
              dispatch({ type: "ADD_ITEM", payload: productData });
            }}
          >
            + افزودن به سبد خرید
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Products;
