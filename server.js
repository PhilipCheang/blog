//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Sure, here's an example starting content for your blog's home page: Welcome to our blog! We are thrilled to have you here. Our blog is a platform for sharing knowledge, experiences, and stories from a diverse group of writers. We cover a wide range of topics, from technology to travel, lifestyle to business, and much more. Our goal is to provide high-quality, informative, and engaging content that our readers can relate to and learn from. We are committed to bringing you the latest trends, tips, and insights in our field, and we do so through a variety of mediums, including articles, videos, and podcasts. Our team of expert writers comes from a wide range of backgrounds and industries, and each brings a unique perspective to our content. At our core, we believe that knowledge is power, and that sharing our experiences and insights can help others learn and grow. We also believe in the power of community and collaboration, and we strive to create a space where our readers can connect, share, and support one another. Whether you're here to learn something new, be inspired, or just have a good read, we're glad you've joined us. So grab a cup of coffee, sit back, and enjoy our latest content. And don't forget to subscribe to our newsletter and follow us on social media to stay up-to-date with all the latest from our blog!";
const aboutContent = "Welcome to our blog! We are a group of passionate writers who are dedicated to sharing our knowledge and experiences with the world. Our blog covers a wide range of topics, including technology, lifestyle, travel, and much more. Our team is made up of experts from various fields, who bring a unique perspective and insight to our content. We believe that by sharing our experiences, we can help others learn and grow, and that's what motivates us to keep writing. Our mission is to provide our readers with high-quality, informative, and engaging content that they can relate to and learn from. We want to inspire and empower our readers to pursue their passions, try new things, and live their best lives. We also love hearing from our readers! If you have any feedback, comments, or suggestions, please don't hesitate to get in touch with us. You can contact us through our website or social media channels, and we'll do our best to get back to you as soon as possible. Thank you for visiting our blog, and we hope you enjoy reading our content as much as we enjoy creating it!";
const contactContent = "We would love to hear from you! Whether you have a question, feedback, or just want to say hello, we encourage you to get in touch with us. You can contact us by filling out the contact form on our website, or by sending an email to our team. We'll do our best to get back to you as soon as possible. In addition to our website, you can also connect with us on social media. Follow us on Twitter, Instagram, and Facebook to stay up-to-date with our latest content, and to join our community of readers and followers. If you're interested in collaborating with us or have a business inquiry, please feel free to reach out to us through our contact form or by email. We're always looking for new partnerships and opportunities to work with others in our industry. Thank you for your interest in our blog, and we look forward to hearing from you soon!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch((err) => console.log(err));
async function main() {
  
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  });
} 

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res){
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the posts.");
  }
});

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});


app.get("/posts/:postId", async function(req, res){
  const requestedPostId = req.params.postId;
  try {
    const post = await Post.findOne({_id: requestedPostId});
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the post.");
  }
});



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
