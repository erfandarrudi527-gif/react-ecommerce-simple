import { useState, useEffect, useRef } from "react";
import { Container, Grid, Typography, TextField, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import StarIcon from "@mui/icons-material/Star";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import BoltIcon from "@mui/icons-material/Bolt";

const features = [
  { icon: <RocketLaunchIcon fontSize="inherit" />, title: "ارسال سریع", desc: "تحویل درب منزل در کمتر از ۴۸ ساعت برای سراسر کشور، با بسته‌بندی حرفه‌ای و ایمن." },
  { icon: <ShieldIcon fontSize="inherit" />, title: "پرداخت امن", desc: "درگاه پرداخت بانکی معتبر با رمزنگذاری end-to-end برای حفاظت کامل از اطلاعات شما." },
  { icon: <BoltIcon fontSize="inherit" />, title: "پشتیبانی ۲۴/۷", desc: "تیم پشتیبانی ما به صورت شبانه‌روزی آماده پاسخگویی به سوالات و مشکلات شماست." },
  { icon: <StarIcon fontSize="inherit" />, title: "کیفیت برتر", desc: "تمام محصولات ما از برندهای معتبر جهانی انتخاب شده و دارای گارانتی اصالت هستند." },
];

const stats = [
  { num: "۵۰K+", label: "مشتری راضی" },
  { num: "۲۰۰+", label: "محصول متنوع" },
  { num: "۹۹٪", label: "رضایت مشتری" },
  { num: "۴.۹", label: "امتیاز فروشگاه" },
];

const team = [
  { name: "علی رضایی", role: "مدیرعامل", initial: "ع", color: "linear-gradient(135deg, #22d3ee, #3b82f6)" },
  { name: "مریم کریمی", role: "مدیر محصول", initial: "م", color: "linear-gradient(135deg, #a855f7, #ec4899)" },
  { name: "حسین مرادی", role: "طراح ارشد", initial: "ح", color: "linear-gradient(135deg, #10b981, #22d3ee)" },
  { name: "زهرا احمدی", role: "پشتیبانی", initial: "ز", color: "linear-gradient(135deg, #f59e0b, #ef4444)" },
];

// هوک برای scroll reveal با IntersectionObserver
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

// کامپوننت کارت با tilt-on-hover
const TiltCard = ({ children, className, style }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rotateY = ((x - 50) / 50) * 12;
    const rotateX = -((y - 50) / 50) * 12;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`);
    setGlow({ x, y });
  };

  const handleLeave = () => {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) translateZ(0)");
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transform,
        transition: "transform .4s cubic-bezier(.22,1,.36,1)",
        "--gx": `${glow.x}%`,
        "--gy": `${glow.y}%`,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
};

// کامپوننت Ripple برای دکمه
const RippleButton = ({ children, className, onClick, type = "button", href }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((it) => it.id !== id)), 700);
    if (onClick) onClick(e);
  };

  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      type={!href ? type : undefined}
      className={className}
      onClick={handleClick}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-effect"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </Tag>
  );
};

const About = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [featuresRef, featuresVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();
  const [teamRef, teamVisible] = useReveal();
  const [contactRef, contactVisible] = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`پیام شما ارسال شد!\nنام: ${form.name}\nایمیل: ${form.email}`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Box className="about-page">
      {/* هیرو */}
      <Box className="about-hero">
        <Box className="about-hero__particles">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                left: `${(i * 5.3) % 100}%`,
                top: `${(i * 7.1) % 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + (i % 4)}s`,
              }}
            />
          ))}
        </Box>
        <Box className="about-hero__rings">
          <span className="ring ring-1" />
          <span className="ring ring-2" />
          <span className="ring ring-3" />
        </Box>
        <Typography className="about-hero__title">
          <span className="about-hero__glitch" data-text="درباره ما">درباره ما</span>
        </Typography>
        <Typography className="about-hero__sub">
          فروشگاهی برای آینده — با بهترین محصولات و تجربه‌ای مدرن ⚡
        </Typography>
        <Box className="about-hero__scroll-cue">
          <span />
          <span />
          <span />
        </Box>
      </Box>

      <Container maxWidth="lg">
        {/* ویژگی‌ها */}
        <Box ref={featuresRef} className={featuresVisible ? "reveal-section" : ""}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              textAlign: "center",
              mb: 5,
              background: "linear-gradient(135deg, #67e8f9, #a855f7, #67e8f9)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientText 5s ease infinite",
            }}
            className="section-title"
          >
            چرا ما؟ ✨
          </Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {features.map((f, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={i}
                className={`feature-item ${featuresVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <TiltCard className="feature-card">
                  <Box className="feature-card__glow" />
                  <Box className="feature-card__icon">{f.icon}</Box>
                  <Typography className="feature-card__title">{f.title}</Typography>
                  <Typography className="feature-card__desc">{f.desc}</Typography>
                  <span className="feature-card__corner corner-tl" />
                  <span className="feature-card__corner corner-br" />
                </TiltCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* آمار */}
        <Box ref={statsRef} className={statsVisible ? "reveal-section" : ""}>
          <Grid container spacing={2} sx={{ mb: 8 }}>
            {stats.map((s, i) => (
              <Grid
                item
                xs={6}
                md={3}
                key={i}
                className={`stat-item ${statsVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <TiltCard className="stat-card">
                  <Box className="stat-card__bg" />
                  <Typography className="stat-card__num">
                    <span className="counter" data-target={s.num}>{s.num}</span>
                  </Typography>
                  <Typography className="stat-card__label">{s.label}</Typography>
                  <Box className="stat-card__bar">
                    <span style={{ animationDelay: `${(statsVisible ? 0.5 : 0) + i * 0.15}s` }} />
                  </Box>
                </TiltCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* تیم */}
        <Box ref={teamRef} sx={{ mb: 8 }} className={teamVisible ? "reveal-section" : ""}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              textAlign: "center",
              mb: 4,
              background: "linear-gradient(135deg, #67e8f9, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="section-title"
          >
            تیم ما ✨
          </Typography>
          <Grid container spacing={3}>
            {team.map((m, i) => (
              <Grid
                item
                xs={6}
                sm={3}
                key={i}
                className={`team-item ${teamVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <TiltCard className="team-card">
                  <Box className="team-card__orbit">
                    <span className="orbit-dot d1" />
                    <span className="orbit-dot d2" />
                    <span className="orbit-dot d3" />
                  </Box>
                  <Box
                    className="team-card__avatar"
                    style={{ background: m.color }}
                  >
                    {m.initial}
                  </Box>
                  <Typography className="team-card__name">{m.name}</Typography>
                  <Typography className="team-card__role">{m.role}</Typography>
                  <Box className="team-card__social">
                    <span>𝕏</span><span>in</span><span>✉</span>
                  </Box>
                </TiltCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* فرم تماس */}
        <Box ref={contactRef} className={contactVisible ? "reveal-section" : ""}>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={5}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    background: "linear-gradient(135deg, #67e8f9, #a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  className="section-title"
                >
                  تماس با ما 📬
                </Typography>

                {[
                  { icon: <EmailIcon />, label: "ایمیل", text: "info@shop.ir" },
                  { icon: <PhoneIcon />, label: "تلفن", text: "۰۲۱-۱۲۳۴۵۶۷۸" },
                  { icon: <LocationOnIcon />, label: "آدرس", text: "تهران، خیابان آزادی" },
                  { icon: <AccessTimeIcon />, label: "ساعات کاری", text: "شنبه تا پنجشن - ۹ تا ۱۸" },
                ].map((c, i) => (
                  <Box
                    key={i}
                    className={`contact-info contact-info-anim ${contactVisible ? "visible" : ""}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <Box className="contact-info__icon">{c.icon}</Box>
                    <Box>
                      <Typography className="contact-info__label">{c.label}</Typography>
                      <Typography className="contact-info__text">{c.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box component="form" className="contact-form" onSubmit={handleSubmit}>
                <Box className="contact-form__corner corner-tl" />
                <Box className="contact-form__corner corner-tr" />
                <Box className="contact-form__corner corner-bl" />
                <Box className="contact-form__corner corner-br" />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, mb: 2, color: "#e0f2fe", position: "relative", zIndex: 1 }}
                >
                  ارسال پیام ✉️
                </Typography>
                <TextField
                  fullWidth
                  label="نام و نام خانوادگی"
                  variant="outlined"
                  margin="normal"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="ایمیل"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="پیام شما"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
                <RippleButton
                  type="submit"
                  className="submit-btn"
                >
                  ارسال پیام 🚀
                </RippleButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* CTA */}
        <Box className="about-cta">
          <Box className="about-cta__glow" />
          <Typography className="about-cta__title">
            آماده خرید هستید؟ 🛒
          </Typography>
          <Typography className="about-cta__sub">
            همین حالا به فروشگاه ما سر بزنید و بهترین محصولات را با تخفیف ویژه ببینید
          </Typography>
          <RippleButton
            href="/products"
            className="about-cta__btn"
          >
            مشاهده محصولات ←
          </RippleButton>
        </Box>
      </Container>
    </Box>
  );
};

export default About;