const express = require('express')
const router = express.Router()
const {getAll, add, getById, deleteById, updateById, updateStatusContact} =  require('../../controllers/contact');
const {validateBody, isValidId, authenticate} = require('../../middlewares');
const {addSchema, updateFavoriteSchemas} = require('../../models/contact');

router.get('/', authenticate, getAll);
router.post('/', authenticate, validateBody(addSchema), add);
router.get('/:id', authenticate, isValidId, isValidId, getById)
router.put('/:id', authenticate, isValidId, validateBody(addSchema), updateById);
router.delete('/:id', authenticate, isValidId, deleteById);
router.patch('/:id/favorite', authenticate, isValidId, validateBody(updateFavoriteSchemas), updateStatusContact)

module.exports = router;
 