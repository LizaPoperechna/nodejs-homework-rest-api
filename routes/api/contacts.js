const express = require('express')
const router = express.Router()
const Joi = require('joi');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');
const { HttpError } = require('../../helpers/index')


const addSchema = Joi.object({
  name:  Joi.string().min(3).max(50).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().min(3).max(30).required(),
})


router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.status(200).json({
      contacts,
    });
  } catch (err) {
      next(err)
  }
});

router.post('/', async (req, res, next ) => {
  try {
    const {name, email, phone} = req.body;

    const { error }  = addSchema.validate({name, email, phone});

    if (error) {
      throw HttpError(400, 'missing required name field');
    }

    const results = await addContact({name, email, phone});
    
    res.status(201).json({
      results,
    });
  } catch (err) {
      next(err)
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await getContactById(id);

    if (!contact) {throw HttpError(404, 'Not found!')}

    res.status(200).json({
      contact,
    });
  } catch (err) {
      next(err)
  }
})

router.put('/:id',  async(req, res, next) => {
  try {
    const {name, email, phone} = req.body;
    
    const { error }  = addSchema.validate({name, email, phone});
    if (error) {
      throw HttpError(400, "missing fields");
    }

    const { id } = req.params;
    console.log()

    const result = await updateContact(id, {name, email, phone});
   
    if(!result) {
       throw HttpError(404, 'Not found');
    }

    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});




router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await removeContact(id);

    if(!result) {throw HttpError(404, 'Not found!')};

    res.status(200).json({
              msg: "contact deleted",
      })
  } catch (err) {
        next(err)
      }
    });

module.exports = router;
