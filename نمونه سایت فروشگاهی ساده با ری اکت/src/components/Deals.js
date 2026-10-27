import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import BoltIcon from "@mui/icons-material/Bolt";
import { ProductContext } from "../contexts/ProductContextProvider";
import { CardContext } from "../contexts/CardContextProvider";
import { categoryLabel } from "../helper/functions";

// ===== live countdown to end of today =====
const useCountdown = () => {
  const calc = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(end - now, 0);
    return {
      h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
      m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
      s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

// ===== floating particles =====
const Particles = ({ count = 26 }) => {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        dur: 9 + Math.random() * 14,
        delay: -Math.random() * 20,
        hue: [262, 224, 38, 160][i % 4],
      })),
    [count]
  );
  return (
    <Box className="deals-particles">
      {bits.map((b) => (
        <span
          key={b.id}
          className="deals-particle"
          style={{
            left: b.left + "%",
            width: b.size,
            height: b.size,
            background: `hsl(${b.hue} 85% 65%)`,
            animationDuration: b.dur + "s",
            animationDelay: b.delay + "s",
          }}
        />
      ))}
    </Box>
  );
};

// ===== 3D tilt card =====
const TiltCard = ({ children, ...props }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <Box
      ref={ref}
      className="deal-tilt"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </Box>
  );
};

const Deals = () => {
  const { products } = useContext(ProductContext);
  const { state, dispatch } = useContext(CardContext);
  const { h, m, s } = useCountdown();

  const deals = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 8)
        .map((p, i) => ({
          ...p,
          off: [70, 55, 40, 65, 30, 50, 45, 60][i],
        })),
    [products]
  );

  return (
    <Box className="deals-page">
      <Particles />

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 4, position: "relative", zIndex: 1 }}>
        <Box textAlign="center">
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ color: "#fff !important" }} />}
            label="فقط امروز"
            className="deals-chip animate-pop"
          />
          <Typography variant="h2" className="deals-title animate-in">
            تخفیف‌های{" "}
            <span className="deals-title__grad">شگفت‌انگیز</span>
          </Typography>
          <Typography className="deals-sub animate-in" sx={{ animationDelay: ".1s" }}>
            تا ۷۰٪ تخفیف روی محبوب‌ترین محصولات — قبل از اتمام فرصت اقدام کنید ⚡
          </Typography>

          {/* countdown */}
          <Box className="countdown animate-in" sx={{ animationDelay: ".2s" }}>
            {[
              { v: h, l: "ساعت" },
              { v: m, l: "دقیقه" },
              { v: s, l: "ثانیه" },
            ].map((u, i) => (
              <React.Fragment key={u.l}>
                <Box className="countdown__cell">
                  <Box className="countdown__num" key={u.v}>
                    {u.v}
                  </Box>
                  <Typography className="countdown__label">{u.l}</Typography>
                </Box>
                {i < 2 && <Box className="countdown__sep">:</Box>}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Container>

      {/* deal cards */}
      <Container maxWidth="lg" sx={{ pb: 10, position: "relative", zIndex: 1 }}>
        <Grid container spacing={4}>
          {deals.map((p, i) => {
            const price = (p.price * (1 - p.off / 100)).toFixed(2);
            const inCart = state.selectedItems.find((x) => x.id === p.id);
            return (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <TiltCard className="animate-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <Box className="deal-card">
                    <Box className="deal-card__off">-{p.off}٪</Box>
                    <Link to={`/products/${p.id}`} className="deal-card__media">
                      <img src={p.image} alt={p.title} loading="lazy" />
                    </Link>
                    <Box className="deal-card__body">
                      <Chip
                        size="small"
                        label={categoryLabel(p.category)}
                        className="deal-card__cat"
                      />
                      <Typography className="deal-card__title">
                        {p.title}
                      </Typography>
                      <Box className="deal-card__prices">
                        <Box component="span" className="deal-card__old">
                          {p.price.toLocaleString("fa-IR")}
                        </Box>
                        <Box component="span" className="deal-card__new">
                          {Number(price).toLocaleString("fa-IR")}
                          <span className="product-card__price-unit"> تومان</span>
                        </Box>
                      </Box>
                      <Button
                        className="add-btn"
                        variant="contained"
                        startIcon={<BoltIcon />}
                        onClick={() =>
                          dispatch({ type: "ADD_ITEM", payload: { ...p, price: Number(price) } })
                        }
                      >
                        {inCart ? "در سبد شما ✓" : "خرید با تخفیف"}
                      </Button>
                    </Box>
                  </Box>
                </TiltCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Deals;
