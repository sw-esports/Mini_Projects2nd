const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const userModel = require('./models/user');
const postModel = require("./models/post");
const multerconfig = require('./config/multerconfig');
const upload = require('./config/multerconfig');


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());




app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("index");
});

app.post("/register", async (req, res) => {
    try {
        const { username, email, age, password } = req.body;

        // Check if the user with the given email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.redirect("/register?message=Email already in use");
        }

        // Generate a salt and hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await userModel.create({
            username,
            email,
            age,
            password: hashedPassword
        });

        // Create JWT token
        const token = jwt.sign({ email: newUser.email, userid: newUser._id }, "shh");

        // Set the token in a cookie
        res.cookie("token", token, { httpOnly: true });

        // Redirect to profile page
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.redirect("/login?message=Wrong email or password");

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.redirect("/login?message=Wrong email or password");
        }

        // Create JWT token
        const token = jwt.sign({ email: user.email, userid: user._id }, "shh");

        // Set the token in a cookie
        res.cookie("token", token, { httpOnly: true });

        // Redirect to profile page
        res.redirect("/profile");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
    
    try {
        let user = await userModel .findOne({email:req.user.email}).populate("posts")
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("profile", {user});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/post", isLoggedIn, async (req, res) => {
let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body
   let post = await  postModel.create({
        user: user._id,
        content,

    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile")

});


function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }

    jwt.verify(token, "shh", (err, decoded) => {
        if (err) {
            console.error(err);
            res.clearCookie("token"); // Clear invalid token
            return res.redirect("/login");
        }
        req.user = decoded;
        next();
    });
};

app.get("/like/:id",isLoggedIn, async(req,res)=>{
 let post = await postModel.findOne({_id:req.params.id}).populate("user")
 let userid = req.user.userid
 liked_post = post.likes
if(liked_post.indexOf(userid) === -1){
    liked_post.push(userid)
}else{
  post.likes.splice(post.likes.indexOf(userid),1)  
}
 await post.save();
res.redirect("/profile")
})

app.get("/edit/:id",isLoggedIn,async(req,res)=>{
    let post = await postModel.findOne({_id:req.params.id})

    res.render("edit",{post})
});

app.post("/update/:id",isLoggedIn,async(req,res)=>{
    let post = await postModel.findOneAndUpdate({_id:req.params.id}, {content : req.body.content})
    res.redirect("/profile")
})
app.get("/delete/:id",isLoggedIn,async(req,res)=>{
    let post = await postModel.findOneAndDelete({_id:req.params.id})
    res.redirect("/profile")
})

app.get("/upload",isLoggedIn,async(req ,res)=>{
    try {
        let user = await userModel .findOne({email:req.user.email}).populate("posts")
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("upload", {user});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/upload",isLoggedIn,upload.single('image'),async(req,res)=>{
    let user = await userModel .findOne({email:req.user.email})
    user.profilepic = req.file.filename;
    await user.save()
    res.redirect("/profile")
})
app.get('/chat', isLoggedIn, async(req, res) => {
    let user = await userModel.findOne({email:req.user.email});
    res.render('chat', { user, messages: [] });
  });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io logic goes here
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('alert', '<%=user.username%> joined the chat');
  
    // Handle sending messages
    // When receiving a message from a client
// When receiving a message from a client
socket.on('send message', (data) => {
  // Broadcast the message to all clients along with the sender's username and timestamp
  io.emit('new message', { message: data.message, sender: data.username, timestamp: new Date().toLocaleTimeString('en-US',{
    hour:'2-digit',
    minute:'2-digit',
    hour12:true
  }) });
});

  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  

server.listen(4000, () => {
  console.log('Server running on port 3000');
});
