'use strict';
const express = require('express');

module.exports = (transltrService, promiseHandler) =>
{
    var router = express.Router();
    let self = this;

    function TransltrController(transltrService, promiseHandler)
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
            promiseHandler(res, transltrService.translate(req.body.text, req.body.from, req.body.to));
        }

        function textRecognize(req, res)
        {
            promiseHandler(res, transltrService.textRecognize(req.body.image, req.body.language));
        }

        function like(req, res)
        {
            if(req.body.text != '' && req.body.text != undefined && req.cookies['transltr'] != req.body.text)
            {
                promiseHandler(res, transltrService.like(req.body.text))
                res.cookie('transltr', req.body.text);
            }
            else
            {
                res.send({success: false});
            }
        }

        function dislike(req, res)
        {
            if(req.body.text != '' && req.body.text != undefined && req.cookies['transltr'] != req.body.text)
            {
                promiseHandler(res, transltrService.dislike(req.body.text))
                res.cookie('transltr', req.body.text);
            }
            else
            {
                res.send({success: false});
            }
        }

        function getStatistics(req, res)
        {
            promiseHandler(res, transltrService.getStatistics(req.body.start, req.body.finish));
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

    return new TransltrController(transltrService, promiseHandler);
};