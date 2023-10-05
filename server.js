const inspectorRoutes = require("./routes/inspectorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const express = require("express");
const config = require("config");
const cors = require("cors");
const app = express();

connectDB();

//this code provide memory for save user images in database
app.use(bodyParser.json({ limit: "7mb" }));
app.use(bodyParser.urlencoded({ limit: "7mb", extended: true, parameterLimit: 7000 }));

// list of allowed origins that currently contains URLs and Regexp entries
var allowedOrigins = [config.get("FRONTEND_PRODUCTION"), config.get("FRONTEND_DEVELOPMENT"), config.get("FRONTEND_LOCAL")];

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
      var message =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(message), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/users" , userRoutes);
app.use("/api/doctors" , doctorRoutes);
app.use("/api/patients" , patientRoutes);
app.use("/api/inspectors" , inspectorRoutes);

const port = config.get("PORT") || 6678;

app.get("/", (req, res) => {
  res.status(200).send("Hello server is running").end();
});

app.listen(port, () => {
  console.log(`Server started and listening onn port: ${port}`);
});