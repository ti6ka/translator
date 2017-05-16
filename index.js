'use strict';
const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multiparty = require('connect-multiparty');

const errors = require('./utils/errors');
const config = require('./config');

const dbcontext = require('./context/db')(Sequelize, config);

const yandexService = require('./services/yandex')(dbcontext.yandex, errors);
const transltrService = require('./services/transltr')(dbcontext.transltr, errors);

const apiController = require('./controllers/api')(yandexService, transltrService, config);

const app = express();

app.use(express.static('public'));
app.use('/doc', express.static('public/dist'));
app.use(multiparty());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiController);

const port = process.env.PORT || 3000;

dbcontext.sequelize
    .sync()
    .then(() =>
    {
        app.listen(port, () =>
        {
            console.log('Running on http://' + 'localhost' + ':' + port);
        })
    })
    .catch((err) => console.log(err));
