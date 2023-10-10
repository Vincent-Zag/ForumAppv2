const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const PORT = 4000;
const generateID = () => Math.random().toString(36).substring(2, 10);

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


app.post("/api/thread/like", (req, res) => {
	const { threadId, userId } = req.body;
	const result = threadList.filter((thread) => thread.id === threadId);
	const threadLikes = result[0].likes;

	const authenticateReaction = threadLikes.filter((user) => user === userId);

	if (authenticateReaction.length === 0) {
		threadLikes.push(userId);
		return res.json({
			message: "You've reacted to the post!",
		});
	}
	res.json({
		error_message: "You can only react once!",
	});
});

app.post("/api/thread/replies", (req, res) => {
	const { id } = req.body;
	const result = threadList.filter((thread) => thread.id === id);
	res.json({
		replies: result[0].replies,
		title: result[0].title,
	});
});

app.post("/api/create/reply", async (req, res) => {
	const { id, userId, reply } = req.body;
	const result = threadList.filter((thread) => thread.id === id);
	const username = users.filter((user) => user.id === userId);
	result[0].replies.unshift({ name: username[0].username, text: reply });

	 await novu.trigger("topicnotification", {
	 	to: [{ type: "Topic", topicKey: id }],
	 });

	res.json({
		message: "Response added successfully!",
	});
});



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  