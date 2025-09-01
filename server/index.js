const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");   // <-- import cors
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();
const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000'
    ],
    
        credentials: true,
        optionsSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

// Connect DB & Start Server
mongoose.connect(process.env.MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
})
.catch(err => console.error(err));
