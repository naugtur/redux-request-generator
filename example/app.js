var browserify = require("browserify-middleware");
browserify.settings.mode = "development";

var babelify = require("babelify");
var path = require("path");

var options = {
    transform: [babelify],
    extensions: [".js", ".jsx"]
};

var mainFrontendBrowserifier = browserify(path.resolve(__dirname, "index.jsx"), options)


var app = require("express")();

app.get("/index.js", mainFrontendBrowserifier);
app.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname, "index.html"))
})

app.get("/api/list", sendDelayed(function(req) {
    return {
        list: ["foo", "bar", "baz"]
    }
}))
app.get("/api/item/:name", sendDelayed(function(req) {
    return {
        name: req.params.name,
        otherstuff: "kitchen sink"
    }
}))

app.listen(1337);



function sendDelayed(payloadBuilder) {
    return function(req, res) {
        setTimeout(function() {
            res.json(payloadBuilder(req));
        }, 2000);
    }
}
