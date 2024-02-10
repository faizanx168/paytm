const express = require("express");
const { auhtMiddleware } = require("../middleware");
const { Accounts } = require("../db");
const { mongoose } = require("mongoose");
const zod = require("zod");
const router = express.Router();

router.get("/balance", auhtMiddleware, async (req, res) => {
  console.log(req);
  const account = await Accounts.findOne({ userId: req.userId });
  console.log(account);
  res.json({
    balance: account.balance,
  });
});

const transferSchema = zod.object({
  amount: zod.number,
  to: zod.string,
});
router.post("/transfer", auhtMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { success } = transferSchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "Email already taken/Incorrect Inputs",
    });
  }
  const { amount, to } = req.body;
  const account = await User.findOne({ userId: req.userId }).session(session);
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(411).json({
      message: "Insufficient Funds",
    });
  }
  const toAccount = await User.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(411).json({
      message: "Invalid  User",
    });
  }

  await Accounts.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Accounts.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);
  await session.commitTransaction();
  res.json({ message: "Transfer Successful" });
});

module.exports = router;
