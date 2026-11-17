
import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        message: "Admin cannot delete their own account here",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTransactions, totals] =
      await Promise.all([
        User.countDocuments(),
        Transaction.countDocuments(),
        Transaction.aggregate([
          {
            $group: {
              _id: "$type",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const income = totals.find(
      (item) => item._id === "income"
    );

    const expense = totals.find(
      (item) => item._id === "expense"
    );

    res.status(200).json({
      totalUsers,
      totalTransactions,
      totalIncome: income?.total ?? 0,
      totalExpense: expense?.total ?? 0,
    });
  } catch (error) {
    next(error);
  }
};
