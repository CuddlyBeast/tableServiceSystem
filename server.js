const express = require("express");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require('body-parser');
authRoutes = require("./routes/authRoutes");
menuRoutes = require("./routes/menuRoutes");
orderRoutes = require("./routes/orderRoutes");
paymentRoutes = require("./routes/paymentRoutes");

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


app.use(passport.initialize());
app.use(passport.session());


app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);
app.use("/api", paymentRoutes);

app.get('/', (req,res,next) => {
    console.log('Hello, World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})