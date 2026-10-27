import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Chip,
  IconButton,
  Typography,
  Container,
  Grid,
  Rating,
  CardActions,
  Button,
  Box,
} from "@mui/material";
// functions
import { isSelected, quantityCount, categoryLabel } from "../helper/functions";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// context
import { CardContext } from "../contexts/CardContextProvider";
// components
import Loading from "./Loading";
import Banner from "./Banner";
import { GetSingleProducts } from "../services/getSingleProducts";

const DetailsPage = () => {
  const { state, dispatch } = useContext(CardContext);
  const [currentProduct, setCurrentProduct] = useState(null);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const product = await GetSingleProducts(id);
        setCurrentProduct(product);
      } catch (error) {
        console.error("Failed to load product:", error);
        setCurrentProduct(null);
      }
    };
    fetchAPI();
  }, [id]);

  return (
    <Container maxWidth="lg">
      <Grid container>
        {currentProduct ? (
          <Box
            display="flex"
            alignItems="center"
            mt={6}
            sx={{
              margin: "auto",
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <Grid item xs={12} md={5} mt={6}>
              <Box className="detail-img" display="flex" justifyContent="center">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.title}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7} my={5}>
              <Box component="div" className="detail-box animate-in">
                <Typography variant="h5" fontWeight={800} mb={3}>
                  {currentProduct.title}
                </Typography>

                <Box component="div" display="flex" alignItems="flex-start" mb={1}>
                  <Typography
                    component="p"
                    variant="body1"
                    className="detail-label"
                    display="flex"
                    me={1}
                  >
                    جزییات:
                  </Typography>
                  <Typography variant="body1" className="detail-value">
                    {currentProduct.description}
                  </Typography>
                </Box>

                <Box component="div" display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="body1"
                    className="detail-label"
                    sx={{ lineHeight: 2.5 }}
                    display="flex"
                    alignItems="center"
                    me={1}
                  >
                    دسته:
                  </Typography>
                  <Typography variant="body1" className="detail-value">
                    {categoryLabel(currentProduct.category)}
                  </Typography>
                </Box>

                <Box component="div" display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="body1"
                    className="detail-label"
                    sx={{ lineHeight: 2.5 }}
                    display="flex"
                    alignItems="center"
                    me={1}
                  >
                    قیمت:
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color="primary">
                    {currentProduct.price}
                    <span style={{ fontSize: "0.85rem", color: "#8b8a9e" }}>
                      {" "}
                      تومان
                    </span>
                  </Typography>
                </Box>

                <Box component="div" display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="body1"
                    className="detail-label"
                    display="flex"
                    alignItems="center"
                    sx={{ lineHeight: 2.5 }}
                    me={1}
                  >
                    امتیاز:
                  </Typography>
                  <Typography
                    variant="body1"
                    className="detail-value"
                    fontWeight={700}
                  >
                    {currentProduct.rating.rate}
                  </Typography>
                  <Rating
                    sx={{ ms: 1 }}
                    name="half-rating-read"
                    defaultValue={currentProduct.rating.rate}
                    precision={0.1}
                    readOnly
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={400}
                  sx={{ lineHeight: 1, mt: 1 }}
                >
                  {currentProduct.rating.count} عدد از این محصول موجود است
                </Typography>

                <CardActions sx={{ px: 0, mt: 2 }}>
                  {quantityCount(state, currentProduct.id) > 1 && (
                    <IconButton
                      onClick={() =>
                        dispatch({
                          type: "DECREASE",
                          payload: currentProduct,
                        })
                      }
                      aria-label="کاهش تعداد"
                      size="medium"
                    >
                      <RemoveCircleIcon fontSize="medium" color="primary" />
                    </IconButton>
                  )}
                  {quantityCount(state, currentProduct.id) === 1 && (
                    <IconButton
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          payload: currentProduct,
                        })
                      }
                      color="error"
                      aria-label="حذف از سبد"
                      size="medium"
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  )}
                  {quantityCount(state, currentProduct.id) > 0 && (
                    <Chip
                      size="medium"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 800 }}
                      label={quantityCount(state, currentProduct.id)}
                    />
                  )}
                  {isSelected(state, currentProduct.id) ? (
                    <IconButton
                      aria-label="افزایش تعداد"
                      size="medium"
                      onClick={() =>
                        dispatch({
                          type: "INCREASE",
                          payload: currentProduct,
                        })
                      }
                    >
                      <AddCircleIcon fontSize="medium" color="primary" />
                    </IconButton>
                  ) : (
                    <Button
                      className="add-btn"
                      variant="contained"
                      onClick={() =>
                        dispatch({
                          type: "ADD_ITEM",
                          payload: currentProduct,
                        })
                      }
                    >
                      افزودن به سبد خرید
                    </Button>
                  )}
                </CardActions>
                <Link
                  to="/products"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "fit-content",
                    marginTop: "15px",
                    color: "#00000099",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  <ArrowBackIosIcon fontSize="small" />
                  <Typography>بازگشت به فروشگاه</Typography>
                </Link>
              </Box>
            </Grid>
          </Box>
        ) : (
          <Grid item xs={12}>
            <Loading />
          </Grid>
        )}
      </Grid>
      <Box sx={{ display: { xs: "none", sm: "flex" } }}>
        <Banner />
      </Box>
    </Container>
  );
};

export default DetailsPage;
