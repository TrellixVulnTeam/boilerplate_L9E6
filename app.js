require("dotenv").config();

const app = require("./config");

const PORT = 3000;

app.get("/", (request, response) => {
  response.render("index");
});

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
