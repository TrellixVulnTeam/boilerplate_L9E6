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

const sampleData = {
  meta: {
    data: {
      title: "lesley",
      description: "hello",
    },
  },
};

// app.use

// get meta
// #TODO: refactor this later
// async function getMetaAndAbout(request) {
//   let data = await connectToDB(request);
//   let results = await data.query(
//     Prismic.Predicates.any("document.type", [
//       "meta",
//       "about",
//     ])
//   );
//   return results;
// }
// app.get("/test", (request, response) => {
//   return getMetaAndAbout(request)
//     .then(function (data) {
//       console.log("HELLO");
//       return data;
//     })
//     .then(function (prismicData) {
//       const { results } = prismicData;
//       const [meta, about] = results;

//       response.render("pages/about", {
//         meta,
//         about,
//       });
//     })
//     .catch((error) => {
//       console.log("error", error);
//     });
// });
app.get("/about", async (request, response) => {
  const api = await connectToDB(request);
  const meta = await api.getSingle("meta");
  const about = await api.getSingle("about");
  let galleryImages = about.data.body[0].items;
  response
    .render("pages/about", {
      meta,
      about,
      galleryImages,
    })
    .catch((error) => {
      console.log("error", error);
    });
});
app.get("/collections", (request, response) => {
  response.render("pages/collections", sampleData);
});

app.get("/detail/:uid", async (request, response) => {
  const api = await connectToDB(request);
  const meta = await api.getSingle("meta");
  // fetchLinks allows you to get content from a linked document (e.g., if product has a linked collection type)
  const product = await api.getByUID(
    "product",
    request.params.uid,
    {
      fetchLinks: "collection.title",
    }
  );

  console.log("product", product);
  response
    .render("pages/detail", {
      meta,
      product,
    })
    .catch((error) => {
      console.log("error", error);
    });
});

app.get("/", (request, response) => {
  response.render("pages/home", sampleData);
});
module.exports = app;
