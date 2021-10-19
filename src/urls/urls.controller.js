const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: urls.length + 1,
    href,
    //time: Date.now(),
    //urlId: urls.length + 1,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
  //console.log(urls);
}

function destroy(req, res) {
  const { urlId } = req.params;
  const index = urls.findIndex((url) => url.id === Number(urlId));
  if (index > -1) {
    urls.splice(index, 1);
  }
  res.sendStatus(204);
}

function hasHref(req, res, next) {
  const { data: { href } = {} } = req.body;

  if (href) {
    return next();
  }
  next({ status: 400, message: "An 'href' property is required." });
}

function list(req, res) {
  res.json({ data: urls });
}

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  if (foundUrl) {
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${req.params.urlId}`,
  });
}

function read(req, res) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  const newUseId = uses.length + 1;
  const use = { id: newUseId, urlId: foundUrl.id, time: Date.now() };

  uses.push(use);

  res.json({ data: foundUrl });
}

function update(req, res) {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId);

  const { data: { href } = {} } = req.body;

  foundUrl.href = href;

  res.json({ data: foundUrl });
}

module.exports = {
  create: [hasHref, create],
  list,
  read: [urlExists, read],
  update: [urlExists, hasHref, update],
  delete: destroy,
  urlExists,
};


