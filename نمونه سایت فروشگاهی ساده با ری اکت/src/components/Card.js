import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Box, IconButton, Typography, Container, Grid } from "@mui/material";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// context
import { CardContext } from "../contexts/CardContextProvider";
// functions
import { categoryLabel } from "../helper/functions";

const Card = (props) => {
  const { dispatch } = useContext(CardContext);
  const { image, title, price, quantity, id, category } = props.data;

  return (
    <Container maxWidth="lg">
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        className="cart-item animate-in"
        sx={{
          padding: "18px",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
        my={2}
      >
        <Grid item display="flex" alignItems="center" gap={2}>
          <img
            src={image}
            alt={title}
            className="cart-item__img"
          />
          <Box>
            <Link to={`/products/${id}`} style={{ textDecoration: "none" }}>
              <Typography className="cart-item__title">{title}</Typography>
            </Link>
            <Typography className="cart-item__category">
              {categoryLabel(category)}
            </Typography>
          </Box>
        </Grid>

        <Typography variant="h6" fontWeight={800} color="primary" px={1}>
          {price}
          <span style={{ fontSize: "0.8rem", color: "#8b8a9e" }}> تومان</span>
        </Typography>

        {/* buttons */}
        <Box display="flex" alignItems="center" gap={0.5}>
          {quantity > 1 ? (
            <IconButton
              onClick={() => dispatch({ type: "DECREASE", payload: props.data })}
              aria-label="کاهش تعداد"
              size="medium"
            >
              <RemoveCircleIcon fontSize="medium" color="primary" />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => dispatch({ type: "REMOVE_ITEM", payload: props.data })}
              aria-label="حذف از سبد"
              size="medium"
              color="error"
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={800} px={1}>
            {quantity}
          </Typography>
          <IconButton
            aria-label="افزایش تعداد"
            size="medium"
            onClick={() => dispatch({ type: "INCREASE", payload: props.data })}
          >
            <AddCircleIcon fontSize="medium" color="primary" />
          </IconButton>
        </Box>
      </Grid>
    </Container>
  );
};

export default Card;
