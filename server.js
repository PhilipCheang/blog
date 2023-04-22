//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "At Jacqui Cleaners, we are dedicated to providing you with exceptional quality, unmatched convenience, and innovative solutions for your dry cleaning needs. Quality is at the forefront of everything we do. Our team pays close attention to the details, taking care of everything from stains and repairs to ensuring that your personal preferences are always met. We understand that your clothes are an investment, and we take great pride in providing the highest level of care for each and every garment that we clean. We believe that convenience is key. That's why we offer a range of services designed to make your life easier, from 24hr dropbox options to our convenient neighborhood locations. We know that your time is valuable, and we strive to make the dry cleaning process as simple and hassle-free as possible. Innovation is what sets us apart. We use state-of-the-art facilities and equipment to provide a dry cleaning experience that is not only better for you, but also better for the environment. Our commitment to sustainability means that we are always looking for ways to reduce our impact and provide our customers with eco-friendly options. At Jacqui Cleaners, we stand behind what we do. Our service guarantee ensures that your dry cleaning is done right and on time, or it's on us. We take great pride in our work and are dedicated to ensuring that every customer is completely satisfied with the results. For over 25 years, our locally owned and operated leadership team has been providing quality and service to the great people of Houston. We are proud to be a part of the Jacqui Cleaners family, and we look forward to serving you.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
