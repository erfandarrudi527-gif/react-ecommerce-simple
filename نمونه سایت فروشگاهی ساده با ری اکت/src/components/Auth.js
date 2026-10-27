import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useAuth } from "../contexts/AuthContextProvider";

const Auth = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password) {
      setError("نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.username.trim(), form.password);
      } else {
        await register(form.username.trim(), form.password, form.name.trim());
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || "خطا در ارتباط با سرور — API در حال اجراست؟";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-page">
      <Box className="auth-blob auth-blob--1" />
      <Box className="auth-blob auth-blob--2" />
      <Container maxWidth="xs" className="auth-card animate-in">
        <Box className="auth-card__head">
          <Box className="auth-card__icon">
            <LockPersonIcon sx={{ fontSize: 34, color: "#fff" }} />
          </Box>
          <Typography variant="h5" fontWeight={800}>
            {mode === "login" ? "ورود به فروشگاه" : "ایجاد حساب کاربری"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {mode === "login"
              ? "برای مشاهده سبد خرید وارد شوید"
              : "همین حالا ثبت‌نام کنید و خرید را شروع کنید"}
          </Typography>
        </Box>

        {/* tabs */}
        <Box className="auth-tabs">
          <Box
            className={
              "auth-tab" + (mode === "login" ? " auth-tab--active" : "")
            }
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            ورود
          </Box>
          <Box
            className={
              "auth-tab" + (mode === "register" ? " auth-tab--active" : "")
            }
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            ثبت‌نام
          </Box>
          <Box
            className="auth-tab__slider"
            sx={{ transform: mode === "login" ? "translateX(0)" : "translateX(-100%)" }}
          />
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {mode === "register" && (
            <TextField
              fullWidth
              label="نام (اختیاری)"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              className="auth-field"
            />
          )}
          <TextField
            fullWidth
            required
            label="نام کاربری"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            className="auth-field"
          />
          <TextField
            fullWidth
            required
            label="رمز عبور"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={form.password}
            onChange={handleChange}
            margin="normal"
            className="auth-field"
          />

          {error && (
            <Alert severity="error" className="auth-error animate-pop" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="auth-submit"
            disabled={loading}
            sx={{ mt: 3, mb: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : mode === "login" ? (
              "ورود"
            ) : (
              "ثبت‌نام"
            )}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          className="auth-switch"
        >
          {mode === "login" ? "حساب کاربری ندارید؟ " : "قبلاً ثبت‌نام کرده‌اید؟ "}
          <Box
            component="span"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="auth-switch__link"
          >
            {mode === "login" ? "ثبت‌نام کنید" : "وارد شوید"}
          </Box>
        </Typography>
      </Container>
    </Box>
  );
};

export default Auth;
