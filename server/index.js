const express = require("express");
const mongoose = require('mongoose');
const validator = require('email-validator');
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


// Define Schemas

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: String,
  username: String,
});

const replySchema = new mongoose.Schema({
  name: String, 
  text: String, 
});

const threadSchema = new mongoose.Schema({
  title: String,
  userId: String,
  replies: [replySchema],
  likes: [String],   
});

const User = mongoose.model('User', userSchema);
const Thread = mongoose.model('Thread', threadSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// This endpoint fetches the user information
app.get("/api/user/:id", async (req, res) => {
    // Retrieve the user by id
    await User.findById(req.params.id)
      .then(userFound => {
        if(!userFound){
          return res.status(404).json({
            error: "Could not find user with that id.",
          });
        }
        return res.status(200).json(userFound);
      })
      .catch(err => {
        console.error("Error fetching user information", err);
        res.status(500).json({
          error_message: "Internal server error",
        });      
      });
});

app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;

  //check for valid email address first
  if(!validator.validate(email)){
    return res.status(422).json({
      error: "Invalid email, please try again!"
    });
  }

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

  try {
    // Create a new thread document and save it to the database
    const newThread = new Thread({ title: thread, userId, replies: [], likes: [] });
    await newThread.save();

    res.json({
      message: "Thread created successfully!",
      thread: newThread,
    });
    
  } catch (error) {
    console.error("Error creating thread", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});

app.get("/api/all/threads", async (req, res) => {
  try {
    // Retrieve all threads from the MongoDB database
    const threads = await Thread.find({});

    res.json({
      threads,
    });
  } catch (error) {
    console.error("Error fetching threads", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});


app.post("/api/thread/like", async (req, res) => {
  const { threadId, userId } = req.body;
  try {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({
        error_message: "Thread not found",
      });
    }

    const threadLikes = thread.likes;
    const isLiked = threadLikes.includes(userId);

    if (isLiked) {
      threadLikes.pull(userId);
    } else {
      threadLikes.push(userId);
    }
    await thread.save();
    res.json({
      message: isLiked ? "You've unliked the post!" : "You've liked the post!",
    });
  } catch (error) {
    console.error("Error during liking/unliking thread", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});


app.post("/api/thread/replies", async (req, res) => {
  const { id } = req.body;
  try {
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        error_message: "Thread not found",
      });
    }
    res.json({
      replies: thread.replies,
      title: thread.title,
    });
  } catch (error) {
    console.error("Error fetching thread replies", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});


app.post("/api/create/reply", async (req, res) => {
  const { id, userId, reply } = req.body;
  try {
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({
        error_message: "Thread not found",
      });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error_message: "User not found",
      });
    }
    const username = user.username;

    thread.replies.unshift({ name: username, text: reply });
    await thread.save();

    res.json({
      message: "Response added successfully!",
    });
  } catch (error) {
    console.error("Error creating reply", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  