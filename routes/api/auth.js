const express = require('express');
const router = express.Router();
const {register, login, getCurrent, logout, updateAvatar, verifyEmail, resendVerifyEmail} = require('../../controllers/auth');
const {validateBody, authenticate, upload} = require('../../middlewares');
const {loginSchema, registerSchema, emailSchema} = require('../../models/user');

router.post('/register', validateBody(registerSchema), register);
router.get('/verify/:verificationToken', verifyEmail)
router.post('/verify', validateBody(emailSchema), resendVerifyEmail);
router.post('/login', validateBody(loginSchema), login);
router.get('/current', authenticate, getCurrent);
router.post('/logout', authenticate, logout);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);


module.exports = router;
 