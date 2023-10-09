const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:password1231@forumthreads.wdom9t6.mongodb.net/forums", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error", error);
  });


// Define a User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
});

const threadSchema = new mongoose.Schema({
    title: String,
    userId: String,
    replies: [String],
    likes: [String],   
});

const User = mongoose.model('User', userSchema);
const Thread = mongoose.model('Thread', threadSchema);
const threadList = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        error_message: "User already exists",
      });
    }

    const newUser = new User({ email, password, username });
    await newUser.save();

    res.json({
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});


app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email, password });
  
      if (!user) {
        return res.json({
          error_message: "Incorrect credentials",
        });
      }
  
      res.json({
        message: "Login successfully",
        id: user._id, 
      });
    } catch (error) {
      console.error("Error during login", error);
      res.status(500).json({
        error_message: "Internal server error",
      });
    }
  });


// Forums
app.post("/api/create/thread", async (req, res) => {
    const { thread, userId } = req.body;
    const threadId = generateID();
    
    const newThread = {
      id: threadId,
      title: thread,
      userId,
      replies: [],
      likes: [],
    };
    
    threadList.unshift(newThread);
  
    res.json({
      message: "Thread created successfully!",
      threads: threadList,
    });
  });
  
//   app.get("/api/all/threads", async (req, res) => {
//     res.json({
//         threads: threadList,
//     });
// });


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  