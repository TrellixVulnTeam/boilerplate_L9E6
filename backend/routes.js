const app = require("./config");

const sampleData = {
  meta: {
    data: {
      title: "lesley",
      description: "hello",
    },
  },
};

app.get("/about", (request, response) => {
  response.render("pages/about", sampleData);
});
app.get("/collections", (request, response) => {
  response.render("pages/collections", sampleData);
});
app.get("/detail/:uid", (request, response) => {
  response.render("pages/detail", sampleData);
});

app.get("/", (request, response) => {
  response.render("pages/home", sampleData);
});
module.exports = app;
