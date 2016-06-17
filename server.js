// server.js
var jsonServer  = require('json-server');
var server      = jsonServer.create();
var router      = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
var bodyParser  = require('body-parser');
var session     = require('express-session');
var cors        = require('cors');
var logger      = require('morgan');

server.use( middlewares ); // JSON-Server defaults middlewares (logger, static, cors and no-cache)

// CORS route
var corsOptions = {
    exposedHeaders: ["X-AUTH-TOKEN"]
}
server.use( cors(corsOptions) );
server.use( bodyParser.json() ); // For parsing application/json
server.use( logger('dev') ); // API request logs
server.use( session({
    secret: 'huehuebr',
    rolling: true
}) ); // To save user in session

// Validate if is loggedin
// server.use(function (req, res, next) {
//     var url = req.url.toLowerCase();

//     if ( url.indexOf('login') < 0 && url.indexOf('logout') < 0 ) {
//         var token = req.session.token;
//         var reqToken = req.headers['x-auth-token'];

//         console.log("Request", url, reqToken, token, req.session );

//         if ( ! reqToken ) {
//             res.status(401).end("Invalid credentials");
//         } else {
//             res.set('X-AUTH-TOKEN', reqToken);
//             next();
//         }
//     } else {
//         next();
//     }
// })



// Do login, and save token and user in session
server.post('/login', function (req, res) {
    var b    = req.body,
        user = b.username,
        pass = b.password;

    // console.log("Login", user, pass, req.body);

    if ( user == 'teste' && pass == '123123' ) {
        var sess  = req.session,
            token = Math.random().toString(36).slice(2);

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


server.use(router);

server.listen(3040, function () {
  console.log('JSON Server is running. Goto http://localhost:3040');
})