const express = require("express");
const mongoose = require("mongoose");
const validator = require("email-validator");
const cors = require("cors");
const session = require("express-session");
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

app.use(
  session({
    secret: "cabniuhd2183y19",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
  

//Schemas
const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    email: {
      type: String,
      required: true,
    },
    password: String,
    username: String,
    likedThreads: [String], 
    repliedThreads: [String], 
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

const Thread = mongoose.model('Thread', threadSchema);
const User = mongoose.model("User", userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
  })
);

function generateUniqueUserId() {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return timestamp + randomString;
}

// load user data
async function loadUserData(req, res, next) {
  if (req.session.userId) {
    try {
      const user = await User.findOne({ userId: req.session.userId });
      if (user) {
        req.session.user = user;
      }
    } catch (error) {
      console.error("Error loading user data", error);
    }
  }
  next();
}

app.use(loadUserData); 

// Register a new user
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

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.json({
        error_message: "Incorrect credentials",
      });
    }
    req.session.userId = user.userId;
    res.json({
      message: "Login successfully",
      userId: req.session.userId
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});

// User logoff
app.post("/api/logoff", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logoff", err);
      res.status(500).json({
        error_message: "Internal server error",
      });
    } else {
      res.json({ message: "Logged off successfully" });
    }
  });
});

app.get("/api/user/authenticated", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, userId: req.session.user.userId });
  } else {
    res.json({ authenticated: false });
  }
});

app.get("/api/user/:userId/profile", (req, res) => {
  if (req.session.user) {
    res.json({
      userId: req.session.user.userId,
      email: req.session.user.email,
      username: req.session.user.username,
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Create a new thread
app.post("/api/create/thread", async (req, res) => {
  if (req.session.user) {
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
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Get all threads
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
  if (req.session.user) {
    const { id, userId, threadId } = req.body;
    console.log(req.body);
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
      thread.markModified('likes'); // Mark the 'likes' array as modified
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
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/api/thread/replies/:threadId", async (req, res) => {
  const threadId = req.params.threadId;

  try {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({
        error_message: "Thread not found",
      });
    }

    res.json({
      title: thread.title,
      replies: thread.replies,
    });
  } catch (error) {
    console.error("Error fetching thread replies", error);
    res.status(500).json({
      error_message: "Internal server error",
    });
  }
});

app.post("/api/create/reply", async (req, res) => {
  if (req.session.user) {
    const { id, userId, reply } = req.body; 
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        error_message: "Invalid ObjectId format for 'id'",
      });
    }
    try {
      const thread = await Thread.findById(id);
      if (!thread) {
        return res.status(404).json({
          error_message: "Thread not found",
        });
      }
      const user = await User.find({userId: userId});
      if (!user) {
        return res.status(404).json({
          error_message: "User not found",
        });
      }
      const username = req.session.user.username;
      console.log("username", username);
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
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//User based Stats
// FUTURE SPRINT
// app.get("/api/user/:userId/replies", async (req, res) => {
//   if (req.session.user) {
//     const userId = req.session.params.userId;
//     try {
//       const userReplies = await Thread.find({ "replies.userId": userId });
//       if (!userReplies) {
//         return res.status(404).json({
//           error_message: "User replies not found",
//         });
//       }
//       const replies = userReplies.map((thread) =>
//         thread.replies.filter((reply) => reply.userId === userId)
//       );
//       res.json({
//         replies,
//       });
//     } catch (error) {
//       console.error("Error fetching user replies", error);
//       res.status(500).json({
//         error_message: "Internal server error",
//       });
//     }
//   } else {
//     res.status(401).json({ error: "Unauthorized" });
//   }  
// });

// app.get("/api/user/:userId/likes", async (req, res) => {
//   if (req.session.user) {
//     const userId = req.session.params.userId;
//     try {
//       const userLikes = await Like.find({ userId });

//       res.json({
//         likes: userLikes,
//       });
//     } catch (error) {
//       console.error("Error fetching user likes", error);
//       res.status(500).json({
//         error_message: "Internal server error",
//       });
//     }
//   } else {
//     res.status(401).json({ error: "Unauthorized" });
//   }  
// });




