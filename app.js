const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const usermodel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');

const server = http.createServer(app);
const io = socketio(server);

app.use(cookieparser());
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

io.on('connection',(socket)=>{
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id: socket.id, ...data});
    });
})

app.get('/', (req,res)=>{
    res.render('index.ejs');
})


app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.post('/signup', async (req, res) => {
    const { name, username, age, email, password } = req.body;
    let user = await usermodel.findOne({ email });
    if (user) return res.status(500).send("User Already Exists");

    bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log(err);
        bcrypt.hash(password, salt, (err, hash) => {
            usermodel.create({
                username: username,
                name: name,
                age: age,
                email: email,
                password: hash
            }).then(user => {
                const token = jwt.sign({ email: email, userid: user._id }, "secretcode");
                res.cookie("token", token, { httpOnly: true });
                res.render("profile.ejs", { user });
            });
        });
    });
});

app.get('/login',(req,res)=>{
    res.render('login.ejs');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) return res.status(500).redirect('/login');

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const token = jwt.sign({ email: email, userid: user._id }, "secretcode");
            res.cookie("token", token, { httpOnly: true });
            res.redirect('/profile');
        } else {
            res.redirect('/login');
        }
    });
});


app.get('/map',(req,res)=>{
    res.render('map')
})

app.get('/profile',isLoggedIn , async (req,res)=>{
    let user = await usermodel.findOne({email: req.user.email});
    res.render("profile", {user});
})

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/')
})

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (token === "") {
      res.render('login');
    } else {
      jwt.verify(token, "secretcode", (err, data) => {
        if (err) {
          res.render('login');
        } else {
          req.user = data;
          next();
        }
      });
    }
}

server.listen(3000,console.log("server is running on port 3000"));