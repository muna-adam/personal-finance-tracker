
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";


export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !["income", "expense"].includes(type)
    ) {
      return res.status(400).json({
        message: "Please provide valid transaction data.",
      });
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount,
      type,
      category: category.trim(),
      ...(date !== undefined && { date }),
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};


export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      createdBy: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};


export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const allowedFields = [
      "title",
      "amount",
      "type",
      "category",
      "date",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one valid field to update",
      });
    }

    if (
      ("title" in updates &&
        (typeof updates.title !== "string" ||
          !updates.title.trim())) ||
      ("category" in updates &&
        (typeof updates.category !== "string" ||
          !updates.category.trim())) ||
      ("amount" in updates &&
        (!Number.isFinite(updates.amount) ||
          updates.amount <= 0)) ||
      ("type" in updates &&
        !["income", "expense"].includes(updates.type))
    ) {
      return res.status(400).json({
        message: "Invalid transaction data",
      });
    }

    if ("title" in updates) {
      updates.title = updates.title.trim();
    }

    if ("category" in updates) {
      updates.category = updates.category.trim();
    }

    if (
      "date" in updates &&
      (typeof updates.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(updates.date) ||
        Number.isNaN(Date.parse(updates.date)))
    ) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const getMonthlySummary = async (req, res, next) => {
  try {
    const now = new Date();

    const year = Number(req.query.year ?? now.getFullYear());
    const month = Number(req.query.month ?? now.getMonth() + 1);

    if (
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100 ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return res.status(400).json({
        message: "Provide a valid year and month (1-12).",
      });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const match = {
      createdBy: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const totals = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const categories = await Transaction.aggregate([
      { $match: { ...match, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const income = totals.find((item) => item._id === "income");
    const expense = totals.find((item) => item._id === "expense");

    const totalIncome = income?.total ?? 0;
    const totalExpense = expense?.total ?? 0;

    return res.status(200).json({
      year,
      month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: totals.reduce(
        (sum, item) => sum + item.count,
        0
      ),
      expensesByCategory: categories.map((item) => ({
        category: item._id,
        total: item.total,
        count: item.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

