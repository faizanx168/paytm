const express = require("express");
const accountRoutes = require("./accountRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();
router.use("/user", userRoutes);
router.use("/account", accountRoutes);
module.exports = router;
