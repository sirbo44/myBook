// imports and global variables
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
let port = 3006;
let users = ["user1", "user2", "user3", "user4", "user5"];

// app setup
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(session({secret:'12345'}));


// import the user Schema from the /models/user directory
let User = require('./models/user')

//Mongodb connection
mongoose.connect('mongodb+srv://agile_user:agile23@sirbo.tbn8eiu.mongodb.net/agile')

//get method for the landing page
app.get('/', (req,res) => {
    
    res.render('pages/login');
})

//post method for the landing page
app.post('/', async (req, res) => {
    //create a variable user with the given by the user name 
    const user = await User.findOne({'username': req.body.username}).exec()
    //if it is not null , which means there exists a user input
    if (user != null){
        //check if the password is the corresponding
        if (user.password == req.body.password){
            //create sessin with the name of the user 
            req.session.username = req.body.username;
            // if it is then go to /home page
            res.redirect('/home')
        }   
        else{
            // if it is not then go to error page and display an error message 
            console.log("error wrong credentials")
            res.render('pages/error', {"error":"Wrong password"})
        }
    }
    else{
        // if the user's input is null go to the error page and display an error message
        console.log("error user not found")
        res.render('pages/error', {"error": "User not found"})
    }
})

//get method for home page
app.get('/home', async (req,res) => {
    if (req.session.username){
        let user  = await User.find();
        let index = users.indexOf(req.session.username);
        let image = user.indexOf(req.session.image);
        let me = await User.findOne({'username': req.session.username}).exec();
        // let index = user.indexOf(req.session.username);
        // let x = user.splice(index+1, 1);
        res.render('pages/home', {'username': req.session.username, 'user':user, 'image':me.image});
        console.log(req.session.image);
        console.log(me.image);
    }
    else{
        res.redirect('/')
    }   
})

//get method for user page
app.get('/user/:username', async (req, res) => {
    let user = await User.findOne({'username': req.params.username}).exec();
    if (user) {
        res.render('pages/user', {"user": user});
    } else {
        res.redirect('/');
    }
});

// logout page
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

app.use(express.static('views/photos'));

// run the server on a specific port
    // the port is available on top
app.listen(port, () => {
    console.log("Server runs on port " + port);
})