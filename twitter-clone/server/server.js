const express = require("express");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan("tiny"));
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/tweets", require("./routes/tweets"));
app.use("", (req, res) => res.sendStatus(404));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
