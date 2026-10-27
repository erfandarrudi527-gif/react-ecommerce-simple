import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Typography,
  Toolbar,
  AppBar,
  Badge,
  IconButton,
  Container,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
// icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CallIcon from "@mui/icons-material/Call";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
// context
import { CardContext } from "../../contexts/CardContextProvider";
import { useAuth } from "../../contexts/AuthContextProvider";

const Navbar = () => {
  const { state } = useContext(CardContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/products");
  };

  return (
    <AppBar position="sticky" className="navbar-glass">
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/products" className="navbar-brand">
              <Typography variant="h6" component="div">
                🛍️ فروشگاه
              </Typography>
            </Link>
            <Box className="navbar-links">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  "navbar-link" + (isActive ? " active" : "")
                }
              >
                <HomeIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 0.5 }} />
                محصولات
              </NavLink>
              <NavLink
                to="/deals"
                className={({ isActive }) =>
                  "navbar-link" + (isActive ? " active" : "")
                }
              >
                <LocalFireDepartmentIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 0.5, color: "#fbbf24" }} />
                تخفیف‌ها
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  "navbar-link" + (isActive ? " active" : "")
                }
              >
                <CallIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 0.5 }} />
                تماس با ما
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  "navbar-link" + (isActive ? " active" : "")
                }
              >
                <InfoIcon sx={{ fontSize: 18, verticalAlign: "middle", mr: 0.5 }} />
                درباره ما
              </NavLink>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link to="/cards">
              <IconButton className="navbar-cart-btn">
                <Badge badgeContent={state.itemsCounter} color="secondary">
                  <ShoppingCartIcon sx={{ fontSize: "28px", color: "#fff" }} />
                </Badge>
              </IconButton>
            </Link>

            {user ? (
              <>
                <IconButton className="navbar-user-btn" onClick={handleMenu}>
                  <Avatar
                    sx={{
                      width: 36, height: 36,
                      bgcolor: "transparent",
                      background: "linear-gradient(135deg, #22d3ee, #a855f7)",
                      color: "#020617",
                      fontWeight: 900,
                      fontSize: 16,
                    }}
                  >
                    {(user.name?.[0] || user.username?.[0] || "U").toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      background: "rgba(11, 20, 36, 0.95)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(34, 211, 238, 0.3)",
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(34, 211, 238, 0.25)",
                      minWidth: 200,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(34, 211, 238, 0.2)" }}>
                    <Typography sx={{ color: "#67e8f9", fontWeight: 800, fontSize: "0.9rem" }}>
                      {user.name || user.username}
                    </Typography>
                    <Typography sx={{ color: "#7dd3fc", fontSize: "0.78rem" }}>
                      @{user.username}
                    </Typography>
                  </Box>
                  <MenuItem
                    onClick={() => { handleClose(); navigate("/dashboard"); }}
                    sx={{ color: "#e0f2fe", gap: 1, py: 1.2 }}
                  >
                    <DashboardIcon fontSize="small" /> داشبورد
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{ color: "#f43f5e", gap: 1, py: 1.2 }}
                  >
                    <LogoutIcon fontSize="small" /> خروج
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                className="navbar-login-btn"
                startIcon={<LoginIcon />}
              >
                ورود
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;