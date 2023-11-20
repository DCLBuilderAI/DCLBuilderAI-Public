const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

router.post('/toolTest', viewController.getToolPage);
router.post('/generate', viewController.generateResponse);
router.post('/generateB', viewController.generateResponseDaVinci);
router.post('/generateC', viewController.generateResponseCurie);
router.post('/addToTrainingSet', viewController.UpdateTrainingData);
router.post('/submit-waitlist', viewController.EmailWaitlist);
router.post('/run3dModelJob', viewController.get3DModel);
router.post('/loginUser', viewController.loginUser);
router.post('/openLibrary', viewController.getLibrayPage);
router.post('/runTextureJob', viewController.getTexture);
router.get('/login', viewController.getLoginPage);
router.get('/imagine', viewController.getImagePage);
router.get('/tool', viewController.getModelPage);
router.get('/toolScene', viewController.getToolScenePage);
router.get('/toolImage', viewController.getToolDiffuionPage);
router.get('*', viewController.getHomePage);

module.exports = router;
