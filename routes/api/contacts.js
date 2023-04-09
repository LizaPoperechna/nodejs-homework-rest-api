const express = require('express')
const router = express.Router()
const {getAll, add, getById, deleteById, updateById, updateStatusContact} =  require('../../controllers/contact');
const {validateBody, isValidId} = require('../../middlewares');
const {addSchema, updateFavoriteSchemas} = require('../../models/contact');


router.get('/', getAll);

router.post('/', validateBody(addSchema), add);

router.get('/:id', isValidId, isValidId, getById)

router.put('/:id', isValidId, validateBody(addSchema), updateById);

router.delete('/:id', isValidId, deleteById);

router.patch('/:id/favorite', isValidId, validateBody(updateFavoriteSchemas), updateStatusContact)

module.exports = router;
 