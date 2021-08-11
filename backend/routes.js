const app = require("./config");

const Prismic = require("@prismicio/client");
var PrismicDOM = require("prismic-dom");

const ENDPOINT = process.env.PRISMIC_ENDPOINT;
const ACCESS_TOKEN = process.env.PRISMIC_ACCESS_TOKEN;

// Link Resolver - will pass you back for a js object
// checks for type, manages routing for you
function linkResolver(doc) {
  if (doc.type == "product") {
    return `/detail/${doc.slug}`;
  } else if (doc.type == "about") {
    return "/about";
  } else if (doc.type == "collections") {
    return "/collections";
  } else {
    return "/";
  }
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

  res.locals.Links = linkResolver;
  // add PrismicDOM in locals to access them in templates.
  // you can call PrismicDOM in pug files
  res.locals.PrismicDOM = PrismicDOM;

  next();
});

const handleRequest = async (api) => {
  const meta = await api.getSingle("meta");
  const navigation = await api.getSingle("navigation");
  const preloader = await api.getSingle("preloader");
  return Promise.resolve({ meta, navigation, preloader });
};

app.get("/", async (request, response) => {
  const api = await connectToDB(request);
  const defaults = await handleRequest(api);
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );

  const home = await api.getSingle("label");
  console.log("home", home.data);
  const navigation = await api.getSingle("navigation");
  console.log(navigation);
  response.render("pages/home", {
    collections,
    home,
    ...defaults,
  });
});
app.get("/about", async (request, response) => {
  const api = await connectToDB(request);
  const about = await api.getSingle("about");
  const defaults = await handleRequest(api);
  let galleryImages = about.data.body[0].items;
  response.render("pages/about", {
    ...defaults,
    about,
    galleryImages,
  });
});
app.get("/collections", async (request, response) => {
  const api = await connectToDB(request);
  const defaults = await handleRequest(api);
  const home = await api.getSingle("label");
  // fetchLinks allows you to get content from a linked document (e.g., if product has a linked collection type)
  const { results: collections } = await api.query(
    Prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );
  response.render("pages/collections", {
    collections,
    ...defaults,
    home,
  });
});

app.get("/detail/:uid", async (request, response) => {
  const api = await connectToDB(request);
  const defaults = await handleRequest(api);
  // fetchLinks allows you to get content from a linked document (e.g., if product has a linked collection type)
  const product = await api.getByUID(
    "product",
    request.params.uid,
    {
      fetchLinks: "collection.title",
    }
  );
  response.render("pages/detail", {
    ...defaults,
    product,
  });
});

module.exports = app;
