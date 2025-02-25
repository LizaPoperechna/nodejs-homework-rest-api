const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require("jimp");
const { uuid } = require('uuidv4');

const { User } = require('../models/user');
const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');

const {SECRET_KEY} = process.env;
// SECRET_KEY=fghjllkvcfiolmnhc - розумію, що не потрібно сюди додавати, але, рапром він потрібен буде для перевірки ДЗ. потім видалю


const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await  User.findOne({email});

    if (user){
        throw HttpError(409, 'Email in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { d: 'identicon'});
    const verificationToken = uuid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = {
        to: email, 
        subject: 'Verification',
        html: `<a target="_blank" href= "http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    console.log(password);

    res.status(201).json({
        email: newUser.email,
		subscription: newUser.subscription,
	});
}

const verifyEmail = async(req, res)=> {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw HttpError(404, 'User not found')
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

    res.status(200).json({
        message: 'Verification successful'
    })
}

const resendVerifyEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, 'User not found')
    }
    if(user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    const verifyEmail = {
        to: email, 
        subject: 'Verification',
        html: `<a target="_blank" href= "http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({
        'message': 'Verification email sent'
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "2d"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({
        token,
		email: user.email,
		subscription: user.subscription,
    })
}

const getCurrent = async(req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        msg: "Logout success"
    })
}

const updateAvatar = async(req, res)=> {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    Jimp.read(tempUpload, async (error, avatar) => {
        if (error)  {throw HttpError(404, 'Not found!')}
        await avatar.resize(250, 250)
            .write(tempUpload);
        await fs.rename(tempUpload, resultUpload);
    });

    
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
}
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}