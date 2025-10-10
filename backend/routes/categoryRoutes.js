const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { validate, categorySchema } = require('../middleware/validators');

router.post('/', validate(categorySchema), CategoryController.createCategory);
router.get('/', CategoryController.findAllCategories);
router.put('/:id', validate(categorySchema), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;