'use strict'

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const {
    USER_ROUTER,
    LISTING_ROUTER,
    SELLER_ROUTER,
    SUPPORT_ROUTER,
    PUBLIC_ROUTER,
    GOOGLE_ROUTER,
    ADMIN_EMAIL
} = require('../routers/router.main');
const Logger = require('../config/_log/mlbrokerage.logger');
const ErrorHandler = require('../utils/_helper/ErrorHandler.helper');
const DataResponseHandler = require('../utils/_helper/DataResponseHandler.helper');
const verifyApiKey = require('../middleware/_auth/api.auth.middleware');
const { GoogleSignInCallback } = require('../controllers/_users/user.controller');
const verifyToken = require('../middleware/_auth/jwt.auth.middleware');

const app = express();

const PORT = process.env.PORT

const InfoLogger = Logger.Get_logger("default");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    maxAge: 31536000
}))

const corsOptions = {

    origin: (origin, callback) => {
        const origins = process.env.ALLOWED_ORIGINS;
        
        const allowedOrigins = origins.split('|');

        console.log("allowedOrigins", allowedOrigins);
        console.log("origin", origin);
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            console.log("dsfgfd");
            
            callback(null, true);
        } else {
            console.log("Cors not allowed", origin);
            
            callback(new Error("Cors not allowed"), false);
        }
    },
    credentials: true
}

app.use(cors(corsOptions));

app.use(cookieParser(process.env.SECRET_KEY))

app.use(express.static(path.join(__dirname, "../views/template")));

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/template", "index.html"));
});

app.use('/', GOOGLE_ROUTER);
app.use('/api/user', USER_ROUTER);
app.use('/api/listing', LISTING_ROUTER);
app.use('/api/seller', SELLER_ROUTER);
app.use('/api/support', verifyToken, verifyApiKey, SUPPORT_ROUTER);
app.use('/api/public', verifyApiKey, PUBLIC_ROUTER);
app.use('/api/admin', verifyApiKey, ADMIN_EMAIL);


// If accessing non-existing route - 404 --------------------------------------------------
app.get("*", (req, res, next) => {

    let error = {
        name: "RESOURCE_NOT_FOUND",
        message: "Route does not exist",
        route: req.url
    };

    const response = DataResponseHandler(
        JSON.stringify(error),
        "RESOURCE_NOT_FOUND",
        404,
        false,
        "Can't process your request right now. Please contact our support team."
    )

    next(response);
});

app.post("*", (req, res, next) => {

    let error = {
        name: "RESOURCE_NOT_FOUND",
        message: "Route does not exist",
        route: req.url
    };

    const response = DataResponseHandler(
        JSON.stringify(error),
        "RESOURCE_NOT_FOUND",
        404,
        false,
        "Can't process your request right now. Please contact our support team."
    )

    next(response);
});
// --------------------------------------------------------------------------------------

app.use(ErrorHandler);

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    InfoLogger.addContext("context", "ML Brokerage");
    InfoLogger.info(`Server listening on port ${PORT}`)
})