const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");
const { validate, transactionSchema } = require("../middleware/validators");
const multer = require('multer');

// Configuração do Multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Formato de arquivo não suportado!'), false);
    }
};
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

-
router.get('/', TransactionController.findAllTransactions);
router.post('/', upload.single('receipt'), validate(transactionSchema), TransactionController.createTransaction);


router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;