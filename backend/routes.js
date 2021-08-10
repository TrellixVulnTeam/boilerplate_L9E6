const app = require("./config");

const Prismic = require("@prismicio/client");
var PrismicDOM = require("prismic-dom");

const ENDPOINT = process.env.PRISMIC_ENDPOINT;
const ACCESS_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

// Connecting to Database
function connectToDB(req) {
  return Prismic.getApi(ENDPOINT, {
    accessToken: ACCESS_TOKEN,
    req: req,
  });
}

// Link Resolver
function linkResolver(doc) {
  // Define the url depending on the document type
  //   if (doc.type === "page") {
  //     return "/page/" + doc.uid;
  //   } else if (doc.type === "blog_post") {
  //     return "/blog/" + doc.uid;
  //   }

  // Default to homepage
  return "/";
}

// Middleware to inject prismic context
app.use(function (req, res, next) {
  res.locals.ctx = {
    endpoint: ENDPOINT,
    linkResolver: linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

const sampleData = {
  meta: {
    data: {
      title: "lesley",
      description: "hello",
    },
  },
};

app.get("/about", (request, response) => {
  connectToDB(request).then(function (api) {
    api
      .query(
        Prismic.Predicates.any("document.type", [
          "meta",
          "about",
        ])
      )
      .then(function (prismicData) {
        console.log("results", prismicData.results[0]);
        const { results } = prismicData;
        const [meta, about] = results;
        response.render("pages/about", { meta, about });
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
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
