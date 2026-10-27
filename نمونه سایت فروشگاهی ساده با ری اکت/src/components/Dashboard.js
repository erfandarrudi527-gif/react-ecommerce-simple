import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "../contexts/AuthContextProvider";
import { ProductContext } from "../contexts/ProductContextProvider";
import { getOrders } from "../helper/orders";
import { categoryLabel } from "../helper/functions";

// animated counter
const Counter = ({ value, prefix = "", suffix = "" }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 900;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span>
      {prefix}
      {Math.round(n).toLocaleString("fa-IR")}
      {suffix}
    </span>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { products } = useContext(ProductContext);
  const orders = getOrders();

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((t, o) => t + Number(o.total || 0), 0);
    const totalItems = orders.reduce(
      (t, o) => t + (o.items || []).reduce((s, i) => s + i.quantity, 0),
      0
    );
    const avg = orders.length ? totalSpent / orders.length : 0;
    return { totalSpent, totalItems, avg, count: orders.length };
  }, [orders]);

  // last 7 days chart
  const chart = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const sum = orders
        .filter((o) => o.date >= d.getTime() && o.date < next.getTime())
        .reduce((t, o) => t + Number(o.total || 0), 0);
      days.push({ label: d.toLocaleDateString("fa-IR", { weekday: "short" }), sum });
    }
    const max = Math.max(...days.map((d) => d.sum), 1);
    return { days, max };
  }, [orders]);

  // category breakdown from ordered items
  const catBreakdown = useMemo(() => {
    const map = {};
    orders.forEach((o) =>
      (o.items || []).forEach((i) => {
        const c = categoryLabel(i.category || "متفرقه");
        map[c] = (map[c] || 0) + i.quantity;
      })
    );
    const arr = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = arr.reduce((t, [, v]) => t + v, 0) || 1;
    return { arr, total };
  }, [orders]);

  const catColors = ["#7c3aed", "#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#0ea5e9"];

  return (
    <Box sx={{ pb: 10 }}>
      {/* Hero */}
      <Box className="dash-hero">
        <Box className="store-hero__blob store-hero__blob--1" />
        <Box className="store-hero__blob store-hero__blob--2" />
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" className="dash-hero__title animate-in">
                سلام {user?.name || user?.username} 👋
              </Typography>
              <Typography className="dash-hero__sub animate-in" sx={{ animationDelay: ".1s" }}>
                به داشبورد شخصی خودت خوش اومدی — آمار خریدت اینجاست
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: "left" }, mt: { xs: 2, md: 0 } }}>
              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={logout}
                className="dash-logout animate-in"
                sx={{ animationDelay: ".15s" }}
              >
                خروج از حساب
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        {/* Stat cards */}
        <Grid container spacing={3}>
          {[
            {
              icon: <ReceiptLongIcon />,
              title: "تعداد سفارش‌ها",
              value: <Counter value={stats.count} />,
              grad: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            },
            {
              icon: <PaidIcon />,
              title: "مجموع خرید (تومان)",
              value: <Counter value={stats.totalSpent} />,
              grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
            },
            {
              icon: <ShoppingBagIcon />,
              title: "اقلام خریداری‌شده",
              value: <Counter value={stats.totalItems} />,
              grad: "linear-gradient(135deg,#10b981,#0ea5e9)",
            },
            {
              icon: <TrendingUpIcon />,
              title: "میانگین هر سفارش (تومان)",
              value: <Counter value={stats.avg} />,
              grad: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
            },
          ].map((s, i) => (
            <Grid item xs={12} sm={6} md={3} key={s.title}>
              <Box className="stat-card animate-in" style={{ animationDelay: `${i * 90}ms` }}>
                <Box className="stat-card__icon" sx={{ background: s.grad }}>
                  {s.icon}
                </Box>
                <Typography className="stat-card__value">{s.value}</Typography>
                <Typography className="stat-card__title">{s.title}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Chart */}
          <Grid item xs={12} md={7}>
            <Box className="dash-panel animate-in" sx={{ animationDelay: ".25s" }}>
              <Typography variant="h6" fontWeight={800} mb={3}>
                📊 خرید ۷ روز اخیر
              </Typography>
              <Box className="chart">
                {chart.days.map((d, i) => (
                  <Box key={i} className="chart__col">
                    <Box className="chart__bar-wrap">
                      <Box
                        className="chart__bar"
                        title={`${d.sum.toLocaleString("fa-IR")} تومان`}
                        sx={{
                          height: `${Math.max((d.sum / chart.max) * 100, d.sum ? 6 : 2)}%`,
                          animationDelay: `${0.3 + i * 0.08}s`,
                        }}
                      />
                    </Box>
                    <Typography className="chart__label">{d.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Category breakdown */}
          <Grid item xs={12} md={5}>
            <Box className="dash-panel animate-in" sx={{ animationDelay: ".3s", height: "100%" }}>
              <Typography variant="h6" fontWeight={800} mb={3}>
                🏷️ دسته‌بندی محبوب تو
              </Typography>
              {catBreakdown.arr.length === 0 ? (
                <Typography color="text.secondary">
                  هنوز خریدی انجام نشده — اولین سفارشت رو ثبت کن!
                </Typography>
              ) : (
                catBreakdown.arr.slice(0, 5).map(([cat, qty], i) => (
                  <Box key={cat} className="cat-row">
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" fontWeight={700}>
                        {cat}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {qty.toLocaleString("fa-IR")} قلم
                      </Typography>
                    </Box>
                    <Box className="cat-row__track">
                      <Box
                        className="cat-row__fill"
                        sx={{
                          width: `${(qty / catBreakdown.total) * 100}%`,
                          background: catColors[i % catColors.length],
                          animationDelay: `${0.4 + i * 0.1}s`,
                        }}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Recent orders */}
        <Box className="dash-panel animate-in" sx={{ mt: 3, animationDelay: ".35s" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={800}>
              🧾 آخرین سفارش‌ها
            </Typography>
            <Button
              component={Link}
              to="/products"
              endIcon={<ArrowForwardIcon />}
              size="small"
              sx={{ fontWeight: 700 }}
            >
              ادامه خرید
            </Button>
          </Box>
          {orders.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" mb={2}>
                هنوز سفارشی ثبت نکرده‌ای
              </Typography>
              <Button variant="contained" component={Link} to="/products" className="add-btn" sx={{ maxWidth: 220 }}>
                شروع خرید
              </Button>
            </Box>
          ) : (
            orders.slice(0, 6).map((o, i) => (
              <Box key={i} className="order-row animate-in" style={{ animationDelay: `${0.4 + i * 0.07}s` }}>
                <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Chip
                    size="small"
                    label={`#${String(o.id).padStart(4, "0")}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 800 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(o.date).toLocaleDateString("fa-IR")}{" "}
                    {new Date(o.date).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    · {o.items.length} محصول · {o.items.reduce((t, x) => t + x.quantity, 0)} قلم
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={800} color="primary">
                  {Number(o.total).toLocaleString("fa-IR")} تومان
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
