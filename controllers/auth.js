const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require("jimp");

const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');

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
    //const avatarURL = gravatar.url(email);
    const avatarURL = gravatar.url(email, { d: 'identicon'});

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL});

    console.log(password);

    res.status(201).json({
        email: newUser.email,
		subscription: newUser.subscription,
	});
}

const login = async(req, res)=> {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);

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
}