// server.js
var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();

server.use(middlewares)

server.post('/auth', function (req, res) {
    console.log( req.params );
    // res.json({ error: "login inválido"});
    res.json( req.params );
});

server.get('/echo', function (req, res) {
  res.jsonp(req.query)
})


server.use(router)
server.listen(3000, function () {
  console.log('JSON Server is running')
})