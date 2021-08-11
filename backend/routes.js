const app = require("./config");

const Prismic = require("@prismicio/client");
var PrismicDOM = require("prismic-dom");

const ENDPOINT = process.env.PRISMIC_ENDPOINT;
const ACCESS_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

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
// Connecting to Database
function connectToDB(req) {
  return Prismic.getApi(ENDPOINT, {
    accessToken: ACCESS_TOKEN,
    req: req,
  });
}

// Middleware to inject prismic context
app.use(function (req, res, next) {
  res.locals.ctx = {
    endpoint: ENDPOINT,
    linkResolver: linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  // you can call PrismicDOM in pug files
  res.locals.PrismicDOM = PrismicDOM;

  next();
});

app.get("/", async (request, response) => {
  const api = await connectToDB(request);
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");
  const home = await api.getSingle("label");
  console.log(home.data.gallery);
  response.render("pages/home", {
    collections,
    home,
    meta,
    preloader,
  });
});
app.get("/about", async (request, response) => {
  const api = await connectToDB(request);
  const meta = await api.getSingle("meta");
  const about = await api.getSingle("about");
  const preloader = await api.getSingle("preloader");
  let galleryImages = about.data.body[0].items;
  response.render("pages/about", {
    meta,
    about,
    galleryImages,
    preloader,
  });
});
app.get("/collections", async (request, response) => {
  const api = await connectToDB(request);
  const meta = await api.getSingle("meta");
  const home = await api.getSingle("label");
  const preloader = await api.getSingle("preloader");
  // fetchLinks allows you to get content from a linked document (e.g., if product has a linked collection type)
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );
  response.render("pages/collections", {
    collections,
    home,
    meta,
    preloader,
  });
});

app.get("/detail/:uid", async (request, response) => {
  const api = await connectToDB(request);
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");
  // fetchLinks allows you to get content from a linked document (e.g., if product has a linked collection type)
  const product = await api.getByUID(
    "product",
    request.params.uid,
    {
      fetchLinks: "collection.title",
    }
  );
  response.render("pages/detail", {
    meta,
    product,
    preloader,
  });
});

module.exports = app;
