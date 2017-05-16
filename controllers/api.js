'use strict';
const express = require('express');

module.exports = (yandexService, transltrService) =>
{
    const router = express.Router();
    const yandexController = require('./yandex')(yandexService, promiseHandler);
    const transltrController = require('./transltr')(transltrService, promiseHandler);

    router.use('/yandex', yandexController);
    router.use('/transltr', transltrController);

    return router;
};

function promiseHandler(res, promise)
{
    promise
        .then((data) => res.json(data))
        .catch((err) => res.error(err));
}
