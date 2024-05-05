const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "post" }
    ]
    ,
    profilepic:{
        type:String,
        default:"default.png"
    }
});

module.exports = mongoose.model("user", userSchema);
