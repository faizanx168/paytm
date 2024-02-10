const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const { Accounts } = require("../db");

const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { auhtMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const success = signupSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "Email already taken/Incorrect Inputs",
    });
  }
  const user = await User.findOne({
    username: body.username,
  });
  if (user && user._id) {
    return res.status(411).json({
      message: "Email already taken/Incorrect Inputs",
    });
  }
  const dbUser = await User.create(body);

  await Accounts.create({
    userId: dbUser._id,
    balance: 1 + Math.random() * 1000,
  });
  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "user created successfully",
    token: token,
  });
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect Inputs",
    });
  }
  const user = User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    return res.json({
      token: token,
    });
  }

  return res.json({
    message: "User Not Found",
  });
});

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/updateUser", auhtMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "error",
    });
  }
  await User.updateOne(req.body, {
    _id: req.userId,
  });
  res.json({
    message: "User updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
