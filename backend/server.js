// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./backend/db.json')
const cors = require('cors');

const middlewares = jsonServer.defaults({
  noCors: true,
  logger: true,
});

server.use(middlewares)
server.use(cors())

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

server.use('/api', router);

// Last in the chain.
// @see https://expressjs.com/en/guide/error-haandling.html
server.use(function (err, req, res, next) {
  if (!err) {
    next();
  }
  else {
    console.log('full err', err);
    res.status(400).send(err.message)
  }
});

server.listen(3005, () => {
  console.log('JSON Server is running')
})


