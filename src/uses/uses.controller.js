const uses = require("../data/uses-data");

function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.find((use) => use.id === Number(useId));
  
  if (index > -1) {
    uses.splice(index, 1);
  }
  res.sendStatus(204);
}

function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  
  if (foundUse) {
    res.locals.use = foundUse;
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${useId}`,
  });
}


function read(req, res, next) {
  res.json({
    data: res.locals.use,
  });
}


function list(req, res) {
  const { urlId } = req.params;
  const byResult = urlId ? (use) => use.urlId == urlId : () => true;
  res.json({ data: uses.filter(byResult) });
}


function update(req, res) {
  const useId = Number(req.params.useId);
  const foundUse = uses.find((use) => use.id === useId);
  
  const { data: { time } = {} } = req.body;
  
  foundUse.time = time;
  
  res.json({ data: foundUse });
}


module.exports = {
  list,
  read: [useExists, read],
  update: [useExists, update],
  delete: [useExists, destroy],
};










