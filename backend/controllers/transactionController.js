const Transaction = require('../models/transaction');
const Category = require('../models/category');

class TransactionController {
    // Função para CRIAR transação 
    static async createTransaction(req, res) {
        const { description, amount, type, date, idCategory } = req.body;
        const idUser = req.user.id;

        try {
            const transactionData = { description, amount, type, date, idCategory, idUser };
            
            if (req.file) {
                transactionData.receiptPath = req.file.path;
            }

            const transaction = await Transaction.create(transactionData);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
        }
    }

    // Função para LISTAR transações 
    static async findAllTransactions(req, res) {
        const idUser = req.user.id;
        try {
            const transactions = await Transaction.findAll({ 
                where: { idUser },
                include: [{ model: Category, attributes: ['name'] }] // Inclui nome da categoria
            });
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar transações', error: error.message });
        }
    }

    
    static async updateTransaction(req, res) {
        const { id } = req.params;
        const idUser = req.user.id;
        const { description, amount, type, date, idCategory } = req.body;

        try {
            const transaction = await Transaction.findOne({ where: { idTransaction: id, idUser } });
            if (!transaction) {
                return res.status(404).json({ message: 'Transação não encontrada ou não pertence ao usuário.' });
            }

            await transaction.update({ description, amount, type, date, idCategory });
            res.status(200).json(transaction);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }
    }

    // --- NOVA FUNÇÃO PARA DELETAR ---
    static async deleteTransaction(req, res) {
        const { id } = req.params;
        const idUser = req.user.id;

        try {
            const transaction = await Transaction.findOne({ where: { idTransaction: id, idUser } });
            if (!transaction) {
                return res.status(404).json({ message: 'Transação não encontrada ou não pertence ao usuário.' });
            }

            await transaction.destroy();
            res.status(204).send(); 
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });
        }
    }
}

module.exports = TransactionController;