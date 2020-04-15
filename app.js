require("dotenv").config();

const express = require("express"),
      app = express(),
      https = require("https"),
      fs = require("fs"),
	  path = require("path"),
	  request = require("request"),
	  flash = require("connect-flash"),
	  session = require("express-session"),
	  indexRoutes = require("./routes/index"),
	  errorRoutes = require("./routes/error"),
	  finesRoutes = require("./routes/fines");

const sslCerts = {
	key: fs.readFileSync(process.env.SSL_KEY),
	cert: fs.readFileSync(process.env.SSL_CERT)
};
	  
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	key: "user_sid",
	secret: "3l3ph4nt",
	resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use(express.json());  
app.use(express.urlencoded());
app.use(flash());
app.use((req, res, next) => {
	res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(finesRoutes);
app.use(errorRoutes);
app.use(indexRoutes);

https.createServer(sslCerts, app).listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is listening!");
});
