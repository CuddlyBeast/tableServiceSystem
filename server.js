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
        formAction: ["'self'", "https://api.web3forms.com"]
      },
    })
  );



const store = new session.MemoryStore();

app.use(session({
    secret: 'hkdlspairjtmchswgqusdfpgkwpdfu',
    cookie: { maxAge: 7280000, httpOnly: true, sameSite: 'none', secure: true },
    resave: false,
    saveUninitialized: false,
    store,
}));


app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "authenticate.html"));
});

app.use(express.static(path.join(__dirname, "public"))); 

app.get('/menu', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); 
});

app.get('/contact', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "contact.html")); 
});

app.get('/payment', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "payment.html")); 
});

app.get('/orders', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "orders.html")); 
});

app.get("/clearCart", (req, res) => {
    req.session.cart = {}
    res.redirect("/menu");
  });

  app.use('/api', authRoutes);
  app.use('/api', menuRoutes);
  app.use('/api', orderRoutes);
  app.use("/api", paymentRoutes);
  app.use("/api", receiptRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})