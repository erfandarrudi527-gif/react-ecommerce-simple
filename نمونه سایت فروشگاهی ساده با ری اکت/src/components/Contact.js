import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const infoCards = [
  { icon: <EmailIcon />, title: "ایمیل", value: "info@shop.ir", grad: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
  { icon: <PhoneIcon />, title: "تلفن", value: "۰۲۱-۱۲۳۴۵۶۷۸", grad: "linear-gradient(135deg,#10b981,#0ea5e9)" },
  { icon: <LocationOnIcon />, title: "آدرس", value: "تهران، خیابان آزادی", grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { icon: <AccessTimeIcon />, title: "ساعات کاری", value: "شنبه تا پنجشنبه ۹ تا ۱۸", grad: "linear-gradient(135deg,#0ea5e9,#7c3aed)" },
];

const faqs = [
  { q: "چقدر طول می‌کشه تا سفارشم برسه؟", a: "سفارش‌های تهران کمتر از ۲۴ ساعت و سایر شهرها حداکثر ۴۸ ساعته تحویل داده میشن." },
  { q: "امکان مرجوعی وجود داره؟", a: "بله، تا ۷ روز پس از تحویل بدون هیچ سوالی مبلغ کامل برگشت داده میشه." },
  { q: "پرداخت در محل دارید؟", a: "در حال حاضر پرداخت فقط به‌صورت آنلاین از طریق درگاه بانکی انجام میشه." },
  { q: "چطور وضعیت سفارشم رو ببینم؟", a: "از طریق داشبورد شخصی‌تون می‌تونید همه سفارش‌ها و وضعیت‌شون رو ببینید." },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "نام خود را وارد کنید";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "ایمیل معتبر نیست";
    if (form.message.trim().length < 10) err.message = "پیام باید حداقل ۱۰ کاراکتر باشد";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }, 1200);
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Box className="contact-hero">
        <Box className="store-hero__blob store-hero__blob--1" />
        <Box className="store-hero__blob store-hero__blob--2" />
        <Typography variant="h3" className="contact-hero__title animate-in">
          با ما در تماس باشید 📞
        </Typography>
        <Typography className="contact-hero__sub animate-in" sx={{ animationDelay: ".1s" }}>
          سوال، پیشنهاد یا انتقادی دارید؟ تیم ما در کمترین زمان پاسخ‌گوه
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          {infoCards.map((c, i) => (
            <Grid item xs={12} sm={6} md={3} key={c.title}>
              <Box className="contact-info-card animate-in" style={{ animationDelay: `${i * 90}ms` }}>
                <Box className="stat-card__icon" sx={{ background: c.grad }}>
                  {c.icon}
                </Box>
                <Typography className="contact-info-card__title">{c.title}</Typography>
                <Typography className="contact-info-card__value">{c.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mt: 0.5 }}>
          {/* form */}
          <Grid item xs={12} md={7}>
            <Box className="dash-panel animate-in" sx={{ animationDelay: ".2s" }}>
              <Typography variant="h5" fontWeight={800} mb={1}>
                ارسال پیام ✉️
              </Typography>
              <Typography color="text.secondary" mb={3} variant="body2">
                فرم زیر را پر کنید — در کمتر از ۲۴ ساعت پاسخ می‌گیرید
              </Typography>

              {sent ? (
                <Box className="contact-success animate-pop">
                  <CheckCircleIcon sx={{ fontSize: 70, color: "#10b981" }} />
                  <Typography variant="h6" fontWeight={800} mt={1}>
                    پیام شما با موفقیت ارسال شد!
                  </Typography>
                  <Typography color="text.secondary" mt={0.5}>
                    به‌زودی با شما تماس می‌گیریم
                  </Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="نام و نام خانوادگی"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        className="auth-field"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ایمیل"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        className="auth-field"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="پیام شما"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        className="auth-field"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                    disabled={sending}
                    className="auth-submit"
                    sx={{ mt: 3, px: 5, py: 1.4 }}
                  >
                    {sending ? "در حال ارسال..." : "ارسال پیام"}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          {/* faq */}
          <Grid item xs={12} md={5}>
            <Box className="dash-panel animate-in" sx={{ animationDelay: ".25s" }}>
              <Typography variant="h5" fontWeight={800} mb={2}>
                سوالات متداول ❓
              </Typography>
              {faqs.map((f, i) => (
                <Accordion key={i} className="contact-faq" disableGutters elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={700}>{f.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 2 }}>
                      {f.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
