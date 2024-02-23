const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
authRoutes = require("./routes/authRoutes");
menuRoutes = require("./routes/menuRoutes");
orderRoutes = require("./routes/orderRoutes");
paymentRoutes = require("./routes/paymentRoutes");
receiptRoutes = require("./routes/receiptRoutes");

require("dotenv").config();

const app = express();

app.use(express.json()); 
app.use(cors());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://unpkg.com/", "https://code.jquery.com"],
        connectSrc: ["'self'", "https://unpkg.com/"],
      },
    })
  );
  

app.use(express.static(path.join(__dirname, "public"))); 

const store = new session.MemoryStore();

app.use(session({
    secret: 'hkdlspairjtmchswgqusdfpgkwpdfu',
    cookie: { maxAge: 7280000, httpOnly: true, sameSite: 'none', secure: false },
    resave: false,
    saveUninitialized: false,
    sameSite: 'none',
    secure: false,
    store,
}));

app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", receiptRoutes);

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Serve the index.html file
});

app.get("/clearCart", (req, res) => {
    req.session.cart = {}
    res.redirect("/menu");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})