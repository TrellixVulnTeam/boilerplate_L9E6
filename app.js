require("dotenv").config();

const app = require("./backend");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
