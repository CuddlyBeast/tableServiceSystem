const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
authRoutes = require("./routes/authRoutes");
menuRoutes = require("./routes/menuRoutes");
orderRoutes = require("./routes/orderRoutes");
paymentRoutes = require("./routes/paymentRoutes");
receiptRoutes = require("./routes/receiptRoutes");

require("dotenv").config();

const app = express();

app.use(express.json()); 
app.use(cors());
app.use(helmet()); 


app.use(session({
    secret: 'hkdlspairjtmchswgqusdfpgkwpdfu',
    cookie: { maxAge: 7280000, httpOnly: true, sameSite: 'none', secure: false },
    resave: false,
    saveUninitialized: false,
    sameSite: 'none',
    secure: false,
}));

app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", receiptRoutes);

app.get('/', (req,res,next) => {
    console.log('Hello, World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})