import express from "express";

import protect from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

import {
  transactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchema.js";

import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
} from "../controllers/transactionController.js";

const router = express.Router();


router.use(protect);


/**
 * @swagger
 * /transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get the logged-in user's transactions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/monthly-summary", getMonthlySummary);



/**
 * @swagger
 * /transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery shopping
 *               amount:
 *                 type: number
 *                 example: 50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  validate(transactionSchema),
  createTransaction
);

/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     tags: [Transactions]
 *     summary: Get monthly income and expense summary
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 10
 *     responses:
 *       200:
 *         description: Monthly summary retrieved
 *       400:
 *         description: Invalid year or month
 *       401:
 *         description: Authentication required
 */
router.get("/", getTransactions);


/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     tags: [Transactions]
 *     summary: Update a transaction owned by the logged-in user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *       400:
 *         description: Invalid input or ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Transaction not found
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete a transaction owned by the logged-in user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Transaction not found
 */
router.put(
  "/:id",
  validate(updateTransactionSchema),
  updateTransaction
);

router.delete("/:id", deleteTransaction);

export default router;
