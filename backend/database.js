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

async function getData(request, type) {
  let data = await connectToDB(request);
  let query = await data.query(
    Prismic.Predicates.any("document.type", type)
  );
  return query;
}
console.log("hello");
