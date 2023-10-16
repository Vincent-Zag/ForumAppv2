const express = require("express");
const mongoose = require("mongoose");
const validator = require("email-validator");
const cors = require("cors");
const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:password1231@forumthreads.wdom9t6.mongodb.net/forums", {
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
  userId: { type: String, unique: true }, // Make userId unique
  email: {
    type: String,
    required: true,
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

const likeSchema = new mongoose.Schema({
  userId: String,
  threadId: String,   
});

const Like = mongoose.model('Like', likeSchema);
const Reply = mongoose.model('Reply', replySchema);
const Thread = mongoose.model('Thread', threadSchema);
const User = mongoose.model("User", userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

function generateUniqueUserId() {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return timestamp + randomString;
}

app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!validator.validate(email)) {
    return res.status(422).json({
      error: "Invalid email, please try again!",
    });
  }

  try {

    const userId = generateUniqueUserId();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        error_message: "User already exists",
      });
    }

    const newUser = new User({ userId, email, password, username });
    await newUser.save();

    res.status(201).json({
      message: "Account created successfully!",
      userId, 
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


  app.get("/api/user/:userId/profile", async (req, res) => {
    const userId = req.params.userId;
    console.log("Fetching profile for user ID:", userId);
  
    try {
      const user = await User.findOne({ userId });
  
      if (!user) {
        return res.status(404).json({
          error_message: "User not found",
        });
      }
  
      res.json({
        userId: user.userId,
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      console.error("Error fetching user profile", error);
      res.status(500).json({
        error_message: "Internal server error",
      });
    }
  });
  



// Forums
app.post("/api/create/thread", async (req, res) => {
  const { thread, userId } = req.body;

  try {
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

app.get("/api/user/:userId/replies", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userReplies = await Thread.find({ "replies.userId": userId });
    if (!userReplies) {
      return res.status(404).json({
        error_message: "User replies not found",
      });
    }
    const replies = userReplies.reduce((accumulator, thread) => {
      accumulator.push(...thread.replies.filter((reply) => reply.userId === userId));
      return accumulator;
    }, []);

    res.json({
      replies,
    });
  } catch (error) {
    console.error("Error fetching user replies", error);
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

//User based Stats

app.get("/api/user/:userId/replies", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userReplies = await Thread.find({ "replies.userId": userId });

    if (!userReplies) {
      return res.status(404).json({
        error_message: "User replies not found",
      });
    }

    const replies = userReplies.map((thread) =>
      thread.replies.filter((reply) => reply.userId === userId)
    );

    res.json({
      replies,
    });
  } catch (error) {
    console.error("Error fetching user replies", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});

app.get("/api/user/:userId/likes", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userLikes = await Like.find({ userId });

    res.json({
      likes: userLikes,
    });
  } catch (error) {
    console.error("Error fetching user likes", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});





app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  