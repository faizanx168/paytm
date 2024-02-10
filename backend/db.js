const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://faizanx168:Saleha08@cluster0.bz4b5u0.mongodb.net/paytm"
);
const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});
const AccountsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});
const Accounts = mongoose.model("Accounts", AccountsSchema);
const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  Accounts,
};
