const {Schema, model} = require('mongoose');
const {handleMongooseErr} = require('../helpers')
const Joi = require('joi');

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
      },
    phone: {
        type: String,
      },
    favorite: {
        type: Boolean,
        default: false,
      },
}, {versionKey: false, timestamps: true});

contactSchema.post('save', handleMongooseErr)

const Contact = model('Contact', contactSchema);


const addSchema = Joi.object({
    name:  Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().min(3).max(30).required(),
    favorite: Joi.boolean(),
  })

const updateFavoriteSchemas = Joi.object({
   favorite: Joi.boolean().required(),
});


module.exports = {
  Contact,
  addSchema,
  updateFavoriteSchemas
}; 