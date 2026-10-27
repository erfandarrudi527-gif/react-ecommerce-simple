const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = 4000;
const DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, "products.json"), "utf8")
);
const IMG_DIR = path.join(__dirname, "public", "img");
const USERS_FILE = path.join(__dirname, "users.json");
const SECRET_FILE = path.join(__dirname, ".secret");

// persistent secret — tokens survive server restarts (stay-logged-in)
const getSecret = () => {
  try {
    return fs.readFileSync(SECRET_FILE, "utf8").trim();
  } catch (e) {
    const s = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(SECRET_FILE, s);
    return s;
  }
};
const SECRET = getSecret();

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
};

// ===== users store (persisted to users.json) =====
const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch (e) {
    return [];
  }
};
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const hashPassword = (password) =>
  crypto.createHmac("sha256", SECRET).update(password).digest("hex");

// simple signed token: base64(payload).signature
const makeToken = (user) => {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      username: user.username,
      name: user.name,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
    })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
};

const verifyToken = (token) => {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  if (
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return null;
    return data;
  } catch (e) {
    return null;
  }
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });

const sendJSON = (res, status, obj) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
};

// image URLs point at the local server (fakestoreapi.com is blocked in Iran)
const withLocalImages = (product, origin) => ({
  ...product,
  image: product.image.replace(
    "https://fakestoreapi.com/img/",
    `${origin}/img/`
  ),
});

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const origin = `http://${req.headers.host}`;
  const url = new URL(req.url, origin);
  const pathname = url.pathname;

  try {
    // ===== AUTH =====
    // POST /auth/register
    if (pathname === "/auth/register" && req.method === "POST") {
      const { username, password, name } = await readBody(req);
      if (!username || !password) {
        return sendJSON(res, 400, {
          message: "نام کاربری و رمز عبور الزامی است",
        });
      }
      if (String(password).length < 4) {
        return sendJSON(res, 400, {
          message: "رمز عبور باید حداقل ۴ کاراکتر باشد",
        });
      }
      const users = loadUsers();
      if (users.find((u) => u.username === username)) {
        return sendJSON(res, 409, {
          message: "این نام کاربری قبلاً ثبت شده است",
        });
      }
      const user = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        username,
        name: name || username,
        passwordHash: hashPassword(String(password)),
      };
      users.push(user);
      saveUsers(users);
      return sendJSON(res, 201, {
        token: makeToken(user),
        user: { id: user.id, username: user.username, name: user.name },
      });
    }

    // POST /auth/login
    if (pathname === "/auth/login" && req.method === "POST") {
      const { username, password } = await readBody(req);
      const users = loadUsers();
      const user = users.find((u) => u.username === username);
      if (!user || user.passwordHash !== hashPassword(String(password))) {
        return sendJSON(res, 401, {
          message: "نام کاربری یا رمز عبور اشتباه است",
        });
      }
      return sendJSON(res, 200, {
        token: makeToken(user),
        user: { id: user.id, username: user.username, name: user.name },
      });
    }

    // GET /auth/me (protected)
    if (pathname === "/auth/me" && req.method === "GET") {
      const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const data = verifyToken(token);
      if (!data) return sendJSON(res, 401, { message: "نیاز به احراز هویت" });
      return sendJSON(res, 200, {
        user: { id: data.id, username: data.username, name: data.name },
      });
    }

    // ===== PRODUCTS =====
    // GET /products
    if (pathname === "/products" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(DATA.map((p) => withLocalImages(p, origin))));
    }

    // GET /products/:id
    const singleMatch = pathname.match(/^\/products\/(\d+)$/);
    if (singleMatch && req.method === "GET") {
      const id = parseInt(singleMatch[1], 10);
      const product = DATA.find((p) => p.id === id);
      if (product) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(withLocalImages(product, origin)));
      }
      return sendJSON(res, 404, { error: "Product not found" });
    }

    // GET /img/:filename — serve product images
    const imgMatch = pathname.match(/^\/img\/(.+)$/);
    if (imgMatch && req.method === "GET") {
      const filename = path.basename(imgMatch[1]);
      const filepath = path.join(IMG_DIR, filename);
      const ext = path.extname(filename).toLowerCase();
      if (fs.existsSync(filepath)) {
        res.writeHead(200, {
          "Content-Type": MIME[ext] || "application/octet-stream",
        });
        return fs.createReadStream(filepath).pipe(res);
      }
      res.writeHead(404);
      return res.end("Image not found");
    }

    // 404
    return sendJSON(res, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    return sendJSON(res, 500, { message: "خطای سرور" });
  }
});

server.listen(PORT, () => {
  console.log(`FakeStore API running on http://localhost:${PORT}`);
  console.log(
    "Endpoints: GET /products | GET /products/:id | GET /img/:filename | POST /auth/register | POST /auth/login | GET /auth/me"
  );
});