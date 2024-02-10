const express = require("express");
const app = express();
const cors = require("cors");
const paytmRoutes = require("./routes/paytmRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/v1", paytmRoutes);
const port = 3000;
app.listen(port, () => {
  console.log("Listening ");
});
