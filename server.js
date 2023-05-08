var bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

//this code provide memory for save user images in database
app.use(bodyParser.json({ limit: "7mb" }));
app.use(bodyParser.urlencoded({ limit: "7mb", extended: true, parameterLimit: 7000 }));

// list of allowed origins that currently contains URLs and Regexp entries
var allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);

      for (var i = 0; i < allowedOrigins.length; i++) {
        var allowedOrigin = allowedOrigins[i];

        // if origin matches an allowed origin, allow the request
        if (typeof allowedOrigin === "string" && allowedOrigin == origin) {
          return callback(null, true);
        } else if (
          allowedOrigin instanceof RegExp &&
          allowedOrigin.test(origin)
        ) {
          return callback(null, true);
        }
      }

      // if origin is not allowed
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 6678;

app.get("/", (req, res) => {
  res.status(200).send("Hello server is running").end();
});

app.listen(port, () => {
  console.log(`Server started and listening onn port: ${port}`);
});