require("dotenv").config();
const nodemailer = require("nodemailer");
const { META_PASSWORD } = process.env;


const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: 'lpoperechna@meta.ua',
    pass: META_PASSWORD
},
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const email = { ...data, from: 'lpoperechna@meta.ua'};
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;