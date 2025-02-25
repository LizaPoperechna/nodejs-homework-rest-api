const { Contact } = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../helpers');


const getAll = async (req, res) => {
      const {_id: owner} = req.user;  
      const {page = 1, limit = 10} = req.query;
      const skip = (page - 1) * limit;
      const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate('owner', 'name email');

      res.status(200).json({
        result,
      });
};

const add = async (req, res) => { 
        const {_id: owner} = req.user;
      
        const result = await Contact.create({...req.body, owner});
        
        res.status(201).json({
          result,
        });
    }

const getById = async (req, res) => {
        const { id } = req.params;
    
        const result = await Contact.findById(id);
    
        if (!result) {throw HttpError(404, 'Not found!')}
    
        res.status(200).json({
          contact,
        });
    }

const deleteById = async (req, res) => {
    const { id } = req.params;

    const result = await Contact.findByIdAndDelete(id);

    if(!result) {throw HttpError(404)};

    res.status(200).json({
        msg: "contact deleted",
    })
    }

const updateById = async(req, res) => {
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    
    if(!result) {throw HttpError(404)};

    res.status(200).json(result);
}

const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    console.log('hi');
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    
    if(!result) {throw HttpError(400, '"missing field favorite"');}

    return res.status(200).json(result);
}

  module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper( getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
    updateStatusContact: ctrlWrapper(updateStatusContact)
}