//import mongoose to customise fields in mongodb
const mongoose = require('mongoose');

//create user and specify fields
var user = new mongoose.Schema({
    username: String,
    password: String, 
    name: String,
    age: Number,
    email: String,
    gender: String,
    interests: Array,
    image: String
}, {collection: 'users'});


const User = mongoose.model('User', user);

//make user exportable
module.exports = User;