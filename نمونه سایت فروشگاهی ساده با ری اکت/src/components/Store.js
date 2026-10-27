import { useContext } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
// context
import { ProductContext } from "../contexts/ProductContextProvider";
// components
import Products from "./common/Products";
import Loading from "./Loading";

const Store = () => {
  const { products, hasError } = useContext(ProductContext);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero */}
      <Box className="store-hero">
        <Box className="store-hero__blob store-hero__blob--1" />
        <Box className="store-hero__blob store-hero__blob--2" />
        <Typography variant="h4" component="h1" className="store-hero__title">
          به فروشگاه خوش آمدید ✨
        </Typography>
        <Typography className="store-hero__subtitle">
          جدیدترین محصولات با بهترین کیفیت — همین حالا سفارش دهید
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {hasError ? (
          <Grid container>
            <Grid item xs={12} mt={8} textAlign="center">
              <Box>
                <Typography variant="h6" color="text.secondary" mb={3}>
                  خطا در دریافت محصولات — اتصال به اینترنت را بررسی کنید
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                >
                  تلاش مجدد
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : products.length ? (
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product.id}
                className="reveal"
                style={{ animationDelay: `${(index % 8) * 80}ms` }}
              >
                <Products productData={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <Loading />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Store;
