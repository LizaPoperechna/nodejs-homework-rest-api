const express = require('express');
const router = express.Router();
const {register, login, getCurrent, logout, updateAvatar} = require('../../controllers/auth');
const {validateBody, authenticate, upload} = require('../../middlewares');
const {loginSchema, registerSchema} = require('../../models/user');

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/current', authenticate, getCurrent);
router.post('/logout', authenticate, logout);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);


module.exports = router;
 