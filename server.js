const express = require("express");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");

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


app.get('/', (req,res,next) => {
    console.log('Hello, World');
});


app.listen(3000, () => {
    console.log("server running");
})