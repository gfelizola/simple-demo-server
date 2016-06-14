// server.js
var jsonServer  = require('json-server');
var server      = jsonServer.create();
var router      = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
var bodyParser  = require('body-parser');
var session     = require('express-session');
var hash        = require('./hash');

// JSON-Server defaults middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// For parsing application/json
server.use(bodyParser.json());

// To save user in session
server.use(session({secret: 'hue-hue-br'}));

// Do login, and save token and user in session
server.post('/login', function (req, res) {
    var b    = req.body,
        user = b.username,
        pass = b.password;

    if ( user == 'teste' && pass == '123123' ) {
        var sess  = req.session,
            token = hash(32);

        sess.user  = { username: "teste" };
        sess.token = token;

        res.set('X-AUTH-TOKEN', token);
        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }

});

// To logout
server.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.json({message: "Logout successful"});
        }
    });
});

// Validate if is loggedin
server.use(function (req, res, next) {
    var url = req.url.toLowerCase();

    if ( url.indexOf('login') < 0 || url.indexOf('logout') < 0 ) {
        var token = req.session.token;
        var reqToken = req.headers['x-auth-token'];

        if ( reqToken != token ) {
            res.status(401).end("Invalid credentials");
        }
    }

    // Continue to JSON Server router
    next()
})


server.use(router)
server.listen(3000, function () {
  console.log('JSON Server is running. Goto http://localhost:3000');
})