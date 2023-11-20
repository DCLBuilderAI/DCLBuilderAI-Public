const catchAsync = require('../utils/catchAsync');
const { all } = require('async');
const sendEmail = require('../utils/email');
const User = require('../model/user');
const Model = require('../model/model');
const Point = require('../model/point');
const Replicate = require("replicate");
const axios = require('axios');

exports.getToolPage = catchAsync(async (req, res, next) => {
  try {
    var id = req.body.id;
    var user = await User.findById(id);

    res.status(200).render('toolScene', {user});
  } catch {

  }
});

exports.getLibrayPage = catchAsync(async (req, res, next) => {
  try {
    var id = req.body.id;
    var user = await User.findById(id);

    const examples = await Model.aggregate([
      { $match: { game: 'Decentraland' } },
      { $sample: { size: 102 } }
    ]);

    res.status(200).render('library', {user, examples});
  } catch {

  }
});

exports.getHomePage = catchAsync(async (req, res, next) => {
  res.status(200).render('home');
});

exports.getTexture = catchAsync(async (req, res, next) => {

  var prompt = req.body.prompt1;
  let id = req.body.id;
  if (!id || !prompt) {
    res.redirect('/');
    return;
  }

  const user = await User.findById(id);
  if (!user || user.game != 'Decentraland') {
    res.redirect('/');
    return;
  }

  if (user.number_of_dcl_calls >= 100) {
    res.json('error');
    console.log('error');
    return;
  }

  const replicate = new Replicate({
    auth: '<please place your key here>',
  });

  const output = await replicate.run(
  "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
  {
    input: {
      prompt: prompt
    }
  }
);

  console.log(output[0]);
  res.json(output[0]);

//   var request = require('request');
//   var options = {
//   'method': 'POST',
//   'url': 'https://stablediffusionapi.com/api/v3/text2img',
//   'headers': {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     "key": "BGRAKECo2irmzYtPjjJt0t1o2p5nyyCzx4tKw7WrLWEbHakqIVZi5MsnalLo",
//     "prompt": prompt,
//     "negative_prompt": null,
//     "width": "512",
//     "height": "512",
//     "samples": "1",
//     "num_inference_steps": "20",
//     "seed": null,
//     "guidance_scale": 7.5,
//     "safety_checker": "yes",
//     "multi_lingual": "no",
//     "panorama": "no",
//     "self_attention": "no",
//     "upscale": "no",
//     "embeddings_model": null,
//     "webhook": null,
//     "track_id": null
//   })
// };
//
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   const response1 = JSON.parse(response.body);
//   console.log(response1.output[0]);
//   res.json(response1.output[0]);
// });

});

exports.getImagePage = catchAsync(async (req, res, next) => {
  const user = await User.findOne({email: "asaxena1415@yahoo.com"});
  res.status(200).render('toolImage', {user});
});

exports.getModelPage = catchAsync(async (req, res, next) => {

  const id = req.query.id;

  if (!id) {
    res.redirect('/login');
  }

  const user = await User.findById(id);

  if (!user) {
    res.redirect('/login');
  }

  res.status(200).render('tool', {user});
});

exports.getToolScenePage = catchAsync(async (req, res, next) => {

  const id = req.query.id;

  if (!id) {
    res.redirect('/login');
  }

  const user = await User.findById(id);

  if (!user) {
    res.redirect('/login');
  }

  res.status(200).render('toolScene', {user});
});

exports.getToolDiffuionPage = catchAsync(async (req, res, next) => {

  const id = req.query.id;

  if (!id) {
    res.redirect('/login');
  }

  const user = await User.findById(id);

  if (!user) {
    res.redirect('/login');
  }

  res.status(200).render('toolDiffusion', {user});
});

exports.getLoginPage = catchAsync(async (req, res, next) => {
  const errorCode = req.query.error;
  let error = "";

  if(errorCode) {
    if(errorCode === "m238dds") {
      error = "Beta access code is incorrect" ;
    } else if(errorCode === "c783hd37") {
      error = "No account associated with this email. Please sign up";
    } else if(errorCode === "c783h192") {
      error = "We've currently closed the private beta and are preparing for the public release on 9/27.";
    } else if(errorCode === "c38923hd") {
      error = "Something went wrong, you were not charged";
    } else if(errorCode === "c7328hd") {
      error = "There was a problem processing your payment. Please try again";
    } else if(errorCode === "c718292") {
      error = "Your Free Trial has been cancelled";
    } else if(errorCode === "c839392") {
      error = "You already have a subscription, please log in instead";
    } else if(errorCode == "c237837") {
      error = "Your card failed the authorization check, please use a valid card"
    } else if(errorCode === "c38923FF") {
      error = "A user with this email already exists. Please log in instead"
    } else {
      res.status(200).render('login1');
    }
    res.status(200).render('login1', {error});
    return;
  }

  res.status(200).render('login1');
});

exports.loginUser = catchAsync(async (req, res, next) => {

  const email = req.body.email;
  const betaAccessCode = req.body.pass;

  let user = await User.findOne({ email : email});
  if (!user) {
    user = await User.findOne({ email : {'$regex': email, $options:'i'} });
    if (user && user.email.toLowerCase() != email.toLowerCase()) {
        user = await User.create({ email : email, beta_access_code: betaAccessCode, game: "Decentraland"});
    }
  }

  if (!user) {
    sendEmail({
             email: 'sdnkjakdjsk@proton.me',
             subject: "DCLBuilderAI - " + email,
             html: "New User Signed Up to DCLBuilderAI"
          });
    user = await User.create({ email : email, beta_access_code: betaAccessCode, game: "Decentraland"});
  }

  if(user.beta_access_code != betaAccessCode) {
    res.redirect('/login?error=m238dds');
    return;
  }

  res.status(200).render('toolScene', {
      user
  });

});

exports.get3DModel = catchAsync(async (req, res, next) => {
  try {
    // res.json();
    // return;
    let prompt = req.body.prompt1;
    let id = req.body.id;
    if (!id || !prompt) {
      res.redirect('/');
      return;
    }

    const user = await User.findById(id);
    if (!user || user.game != 'Decentraland') {
      res.json('error');
      return;
    }

    if (user.number_of_dcl_calls >= 100) {
      res.json('error');
      return;
    }

    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: '<enter key here>',
    });
    const openai = new OpenAIApi(configuration);

    const response1 = await openai.createModeration({
      input: prompt,
    });

    const moderationResult = response1.data.results[0].flagged;
    if(moderationResult) {
        res.json("moderation");
        return;
    }

    await User.findOneAndUpdate({ email: user.email}, { number_of_dcl_calls: user.number_of_dcl_calls + 1 });
    const point = await Point.create({user_id: id, prompt: prompt});
    prompt = encodeURIComponent(prompt.trim().replace("/", " "));
    const url = 'http://54.83.119.51:3001/text_prompt/'+prompt;
    // const url = 'http://18.208.114.167:3001/img_prompt/tennis.jpeg';
    const response = await axios.get(url);
    res.json(response.data)
    point.s3Link = response.data;
    await point.save();

    const subject = 'Your 3D Model was Successfully Generated';
    const html = `<font style='Quicksand'>Hey there,<br><br>
            Your job for '${req.body.prompt1}' has now completed and your model has been generated. Click <a href='${point.s3Link}'>here</a> to download the model file.<br><br>
            Let us know if you have any issues with the tool or need help with anything else.<br><br>
            Thanks,<br>
            DCLBuilderAI Team<br> `;

    sendEmail({
             email: user.email,
             subject: subject,
             html
          });

    sendEmail({
             email: 'sdnkjakdjsk@proton.me',
             subject: subject,
             html
          });

  } catch (err) {
    const user = await User.findById(req.body.id);
    await User.findOneAndUpdate({ email: user.email}, { number_of_dcl_calls: user.number_of_dcl_calls + 1 });
    const html = `<html>${err}</html>`
    sendEmail({
             email: 'asaxena1415@yahoo.com',
             subject: 'Error on DCLBuilderAI',
             html
    });
    res.json('incomplete')
  }
});

exports.EmailWaitlist = catchAsync(async (req, res, next) => {

  const email = req.body.email;
  const subject = "DCLBuilderAI Waitlist - " + email;
  const subject1 = "You are on the DCLBuilderAI Private Beta Waitlist 🚀";
  const html = `${email} has been added to the DCLBuilderAI waitlist`;
  const html1 = `This is a confirmation that you are now on the DCLBuilderAI Private Beta Waitlist. We will notify you when it's your turn to receive access.<br><br>Thanks,<br>DCLBuilderAI Team`;
  sendEmail({
           email: 'sdnkjakdjsk@proton.me',
           subject: subject,
           html
        });

  sendEmail({
           email: email,
           subject: subject1,
           html: html1
        });

  res.status(200).render('home', {entryAdded: true});
});

exports.generateResponseCurie = catchAsync(async (req, res, next) => {

  try {

    const prompt = req.body.prompt1;
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: '<enter key here>',
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "curie:ft-personal-2023-03-01-11-47-44",
      prompt: '/* ' + prompt + ' */\n\n###\n\n',
      temperature: 0.12,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.json(response.data.choices[0].text);

    const user = await User.findOne({email : "asaxena1415@yahoo.com"});
    if(!user) {
      return;
    }

    await User.findOneAndUpdate({ email: "asaxena1415@yahoo.com"}, { number_of_dcl_calls: user.number_of_dcl_calls + 1 });

    // need to add task.wait
    const completion = response.data.choices[0].text.replaceAll("Code:", "").trimStart();
    const prompt1 = prompt.replaceAll(" in decentraland", "");
    const model = await Model.findOne({ prompt : prompt1, completion: completion, game: 'Decentraland'});
    if(!model) {
      await Model.create({ prompt : prompt1, completion: completion, is_ticked: false, game: 'Decentraland', mode: 'curie'});
    }

  } catch (err) {
      // todo: log failed requests
      console.log(err);
      res.json("/* Something went wrong! Please try again or request support if the issue persists.");
  }
});

exports.generateResponseDaVinci = catchAsync(async (req, res, next) => {

  try {

    const prompt = req.body.prompt1;
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: '<enter key here>',
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "davinci:ft-haddock-ai-2023-04-10-21-35-18",
      prompt: '/* ' + prompt + ' */',
      temperature: 0.2,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.json(response.data.choices[0].text);

    const user = await User.findOne({email : "asaxena1415@yahoo.com"});
    if(!user) {
      return;
    }

    await User.findOneAndUpdate({ email: "asaxena1415@yahoo.com"}, { number_of_dcl_calls: user.number_of_dcl_calls + 1 });

    // need to add task.wait
    const completion = response.data.choices[0].text.replaceAll("Code:", "").trimStart();
    const prompt1 = prompt.replaceAll(" in decentraland", "");
    const model = await Model.findOne({ prompt : prompt1, completion: completion, game: 'Decentraland'});
    if(!model) {
      await Model.create({ prompt : prompt1, completion: completion, is_ticked: false, game: 'Decentraland', mode: 'davinci'});
    }

  } catch (err) {
      // todo: log failed requests
      console.log(err);
      res.json("/* Something went wrong! Please try again or request support if the issue persists.");
  }
});

exports.generateResponse = catchAsync(async (req, res, next) => {

  try {

    const prompt = req.body.prompt1;
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: '<enter key here>',
    });
    const openai = new OpenAIApi(configuration);

    const response1 = await openai.createModeration({
      input: prompt,
    });

    const moderationResult = response1.data.results[0].flagged;
    if(moderationResult) {
        res.json("/* Request cannot be completed because it in violation of DCLBuilderAI's rules. */")
        return;
    }

    const response = await openai.createCompletion({
      model: "curie:ft-personal-2023-03-01-11-47-44",
      prompt: '/* ' + prompt + ' */\n\n###\n\n',
      temperature: 0.12,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(response.data.choices[0].message.content);
    res.json(response.data.choices[0].message.content);

    const user = await User.findOne({email : "asaxena1415@yahoo.com"});
    if(!user) {
      return;
    }

    await User.findOneAndUpdate({ email: user.email}, { number_of_dcl_calls: user.number_of_dcl_calls + 1 });

    // need to add task.wait
    const completion = response.data.choices[0].message.content.replaceAll("Code:", "").replaceAll("/*", "--").replaceAll("*/", "").trimStart();
    const prompt1 = prompt.replaceAll(" in decentraland", "");
    const model = await Model.findOne({ prompt : prompt1, completion: completion, game: 'Decentraland'});
    if(!model) {
      await Model.create({ prompt : prompt1, completion: completion, is_ticked: false, game: 'Decentraland', mode: 'gpt-4'});
    }

  } catch (err) {
      // todo: log failed requests
      console.log(err);
      res.json("/* Something went wrong! Please try again or request support if the issue persists.");
  }
});



exports.UpdateTrainingData = catchAsync(async (req, res, next) => {

  try {

    const prompt = req.body.prompt1;
    const completion = req.body.editor1;

    const model = await Model.findOne({ prompt : prompt, completion: completion, game: 'Decentraland'});
    if(!model) {
      await Model.create({ prompt : prompt, completion: completion, game: 'Decentraland', is_ticked: true});
    } else {
      model.is_ticked = true;
      await model.save();
    }

    res.json();

  } catch (err) {
    res.json();
  }
});
