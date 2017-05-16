'use strict';
const express = require('express');

module.exports = (yandexService, promiseHandler) =>
{
    var router = express.Router();
    let self = this;

    function YandexController(yandexService, promiseHandler)
    {
        router.post('/text', translate);
        router.post('/image', textRecognize);
        router.post('/like', like);
        router.post('/dislike', dislike);
        router.post('/statistics', getStatistics);

        registerRoutes();

        return router;

        function translate(req, res)
        {
            promiseHandler(res, yandexService.translate(req.body.text, req.body.from, req.body.to));
        }

        function textRecognize(req, res)
        {
            promiseHandler(res, yandexService.textRecognize(req.body.image, req.body.language));
        }

        function like(req, res)
        {
            if(req.body.text != '' && req.body.text != undefined && req.cookies['yandex'] != req.body.text)
            {
                promiseHandler(res, yandexService.like(req.body.text))
                res.cookie('yandex', req.body.text);
            }
            else
            {
                res.send({success: false});
            }
        }

        function dislike(req, res)
        {
            if(req.body.text != '' && req.body.text != undefined && req.cookies['yandex'] != req.body.text)
            {
                promiseHandler(res, yandexService.dislike(req.body.text))
                res.cookie('yandex', req.body.text);
            }
            else
            {
                res.send({success: false});
            }
        }

        function getStatistics(req, res)
        {
            promiseHandler(res, yandexService.getStatistics(req.body.start, req.body.finish));
        }

        function registerRoutes()
        {
            for (let route in self.routes)
            {
                if (!self.routes.hasOwnProperty(route))
                {
                    continue;
                }
                let handlers = self.routes[route];
                if (handlers == undefined) continue;
                for (let handler of handlers)
                {
                    self.router[handler.method](route, handler.cb);
                }
            }
        }
    }

    return new YandexController(yandexService, promiseHandler);
};