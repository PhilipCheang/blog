//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent =
  "Daily Journal is a blog website that allows users to create and view posts on various topics. It is built using the Express.js framework and MongoDB for data storage. The website consists of multiple pages, including a home page, an about page, a contact page, and a compose page. On the home page, users can see a brief introduction about the blog and a collection of posts. The posts are displayed in reverse chronological order, with the most recent post appearing at the top. Each post shows the title, content, and the date it was created. Users can navigate to the compose page to create their own posts. The compose page provides a form where users can enter the title and content of their post. When the form is submitted, the post is saved to the MongoDB database, and users are redirected back to the home page where they can see their newly created post among the other posts. The website also includes an about page that provides more information about the blog and the team behind it. Additionally, there is a contact page where users can get in touch with the blog's creators by filling out a contact form or sending an email. The project demonstrates the use of server-side rendering with EJS templates to dynamically generate HTML pages. It utilizes the Mongoose library to interact with the MongoDB database, allowing for the storage and retrieval of posts. Overall, the blog project provides a platform for users to share their thoughts, experiences, and knowledge on various topics, creating a community of writers and readers who can engage with and learn from each other's content.";

const aboutContent =
  "Welcome to my blog! I'm a passionate writer and aspiring junior web developer. Through this blog, I aim to share my knowledge, experiences, and insights in the field of web developmentAs I embark on my journey to become a web developer, I am constantly learning and exploring new technologies and techniques. This blog serves as a platform for me to document my progress, share helpful tips and resources, and engage with a community of like-minded peersI invite recruiters and fellow web developers to explore my blog and get a glimpse of my skills and dedication. Your feedback is highly valuable to me, and I would greatly appreciate any suggestions or ideas to improve my blog or enhance my web development skillsIf you are a recruiter or part of a company looking for a passionate and motivated junior web developer, I would love to connect with you. I'm eager to contribute my skills and grow within a supportive and innovative teamThank you for visiting my blog, and I hope you find the content informative and engaging. Let's connect and create amazing things together!";

const contactContent =
  "I would love to hear from you! Whether you have feedback, suggestions, or opportunities, I encourage you to get in touch with me. Your input is valuable in helping me improve my skills as a web developer and create better content on this blog If you have any ideas or features you'd like to see added to the blog, please feel free to share them. I'm always open to new suggestions and eager to enhance the user experience for my readers If you are a recruiter or part of a company looking to hire a junior web developer, I would be thrilled to connect with you. Please reach out to me using the contact form on my web portfolio or by sending an email. I'm excited about potential opportunities to contribute to a team and contribute to meaningful projects Thank you for your interest in my blog and for considering me as a candidate. I look forward to hearing from you soon!";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  });
}

const postSchema = {
  title: String,
  content: String,
  date: {
    type: Date,
  },
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({}).sort({ date: -1 });
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the posts.");
  }
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    date: new Date(),
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send("An error occurred while saving the post: " + err.message);
    });
});

app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;
  try {
    const post = await Post.findOne({ _id: requestedPostId });
    if (!post) {
      // No post found with the given ID
      return res.status(404).send("Post not found");
    }

    const formattedDate = post.date
      ? post.date.toLocaleString("en-US", {
          timeZone: "America/Chicago",
        })
      : ""; // Set a default value for formattedDate if post.date is undefined
    res.render("post", {
      title: post.title,
      content: post.content,
      date: formattedDate, // Add the date field
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the post.");
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
