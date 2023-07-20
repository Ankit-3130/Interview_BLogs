require('../models/database');
require("dotenv").config();
const Category = require('../models/Category');
const Email = require('../models/Email');
const Interview = require('../models/Interview');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

//Nodemailer setup for sending emails

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD
  }
});


/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Interview.find({}).sort({ _id: -1 }).limit(limitNumber);
    const software = await Interview.find({ 'category': 'Software Development' }).limit(limitNumber);
    const DataAnalyst = await Interview.find({ 'category': 'Data Analyst' }).limit(limitNumber);
    const Consult = await Interview.find({ 'category': 'Consultancy' }).limit(limitNumber);

    const data = { latest, software, DataAnalyst, Consult };

    res.render('index', { title: 'Interview Blogs - Home', categories, data });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


/** 
 * GET /subscribe
 * to load the newsletter page

*/
exports.subscribe = async (req, res) => {
  res.render('Subscribe', { title: 'Subscribe to NewsLetter' });
}

/**
 * POST /subscribe-mail
 * to send the collected email for newsletter
 */


exports.subscribeMail = async (req, res) => {
  const newUser = new Email({
    emailId: req.body.email,
    category: req.body.category,
  });

  await newUser.save();
  res.redirect('/');
}


/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Interviews - Categories', categories });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /categories/:id 
 * Categories By Id
*/
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Interview.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Interviews - Categories', categoryById });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET /interview/:id
 * Interview 
*/
exports.exploreInterviews = async (req, res) => {
  try {
    let BlogId = req.params.id;
    const Blog = await Interview.findById(BlogId);
    res.render('InterviewBlog', { title: 'Interviews - Blog', Blog });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * POST /search
 * Search 
*/
exports.searchBlog = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let Blogs = await Interview.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Interview - Search', Blogs });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }

}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const Blogs = await Interview.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Interview - Explore Latest', Blogs });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Interview.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let Blog = await Interview.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Interview - Explore Latest', Blog });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /submit-interview
 * Submit Interview Experience
*/
exports.submitBlog = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-blog', { title: 'Interview - Share Experience', infoErrorsObj, infoSubmitObj });
}

/**
 * POST /submit-interview
 * Submit Interview after post
*/
exports.submitBlogOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }

    const newBlog = new Interview({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      Tips: req.body.tips,
      category: req.body.category,
      image: newImageName
    });


    await newBlog.save();

    //creating mail body using MAILGEN

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
      }
    })

    //Newsletter mail body
    let response = {
      body: {
        name: "Interview Geek",
        intro: "New Interview Experience is Uploaded!",
        table: {
          data: [
            {
              Titel: req.body.name,
              Category: req.body.category,
            }
          ]
        },
        outro: "Looking forward to do read more"
      }
    }


    let mail = await MailGenerator.generate(response)


    const subscribeuser = await Email.find({ 'category': req.body.category });
    subscribeuser.forEach(async (user) => {
      let message = {
        from: process.env.GMAIL_ID,
        to: user.emailId,
        subject: "New Interview Experience",
        html: mail
      }

      await transporter.sendMail(message).then(() => {
        console.log(" msg: E-mail sent Successfully");
      }).catch(error => {
        console.log(error);
      })

    })

    req.flash('infoSubmit', 'Interview has been added.')
    res.redirect('/submit-interview');
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/submit-interview');
  }
}
