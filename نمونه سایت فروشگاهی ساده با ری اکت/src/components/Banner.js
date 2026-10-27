import { useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";
import { ProductContext } from "../contexts/ProductContextProvider";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import { Box, Typography } from "@mui/material";

const Banner = () => {
  const { products } = useContext(ProductContext);

  return (
    <Box className="dark-banner">
      <Box className="dark-banner__head">
        <Typography className="dark-banner__title">
          <span className="dark-banner__dot" />
          محصولات ویژه
        </Typography>
        <Typography className="dark-banner__sub">
          جدیدترین‌ها ←
        </Typography>
      </Box>

      <Swiper
        slidesPerView={5}
        spaceBetween={14}
        slidesPerGroup={1}
        loop={products.length > 5}
        loopFillGroupWithBlank={true}
        speed={700}
        autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="dark-banner__swiper"
        breakpoints={{
          0:   { slidesPerView: 2 },
          600: { slidesPerView: 3 },
          900: { slidesPerView: 5 },
        }}
      >
        {products.map((item, i) => (
          <SwiperSlide key={item.id}>
            <Link
              to={`/products/${item.id}`}
              style={{ textDecoration: "none", display: "block", height: "100%" }}
            >
              <Box
                className="dark-banner-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="dark-banner-card__img"
                />
                <span className="dark-banner-card__price">
                  {Number(item.price).toLocaleString("en-US")}
                </span>
              </Box>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Banner;