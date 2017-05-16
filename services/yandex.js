'use strict';
var needle = require("needle");
var Promise = require("bluebird");
Promise.promisifyAll(needle);
var cloudinary = require('cloudinary');
var dateFormat = require('dateformat');
var validurl = require('valid-url');

cloudinary.config
({
    cloud_name: 'dw79kpjkq',
    api_key: '531891264239351',
    api_secret: 'vr9hWCi2p3y1WrPa9ZyiwgvUIr4'
});

module.exports = (yandexRepository, errors) =>
{
    function YandexService(yandexRepository, errors)
    {
        var self = this;
        self.translate = translate;
        self.textRecognize = textRecognize;
        self.like = like;
        self.dislike = dislike;
        self.getStatistics = getStatistics;

        function translate(text, from, to)
        {
            return new Promise((resolve, reject) =>
            {
                if(text == '' || from == '' || to == '' || text == undefined || from == undefined || to == undefined) reject(errors.nullValue);
                else
                {
                    let param =
                    {
                        key: "trnsl.1.1.20170327T180420Z.c8984d3c2ddc8b15.e4b1ea33bb7a66eb17e8d3d3246a89db4dfee777",
                        text: text,
                        lang: from + "-" + to
                    }
                    needle.request('post', 'https://translate.yandex.net/api/v1.5/tr.json/translate', param, function(err, res)
                    {
                        if (!err)
                        {
                            var day = dateFormat(new Date(), 'yyyy-mm-dd');
                            yandexRepository.findOne({ where: { date: { $like: day } }, raw: true })
                                .then((statistic) =>
                                {
                                    if(statistic === null)
                                    {
                                        let statistics =
                                        {
                                            number_translations: 1,
                                            characters_translation: text.length,
                                            positive_evaluation: 0,
                                            negative_evaluation: 0,
                                            date: day
                                        };
                                        yandexRepository.create(statistics);
                                    }
                                    else
                                    {
                                        let newstatistics =
                                        {
                                            number_translations: statistic.number_translations + 1,
                                            characters_translation: statistic.characters_translation + text.length
                                        };
                                        yandexRepository.update(newstatistics, { where: { date: { $like: day } } });
                                    }
                                    resolve(res.body.text[0]);
                                })
                        }
                        if (err)
                        {
                            reject(errors.failedTranslation);
                        }
                    })
                }
            });
        }

        function textRecognize(image, language)
        {
            return new Promise((resolve, reject) =>
            {
                if(image == '' || language == '' || image == undefined || language == undefined) reject(errors.nullValue);
                if(!validurl.isUri(image)) reject(errors.invalidUrl);
                else
                {
                    let param =
                    {
                        apikey: "bb041811a288957",
                        url: image,
                        language: language
                    }
                    needle.request('post', 'https://api.ocr.space/parse/image', param, function(err, res)
                    {
                        if (!err)
                        {
                            if(!res.body.ParsedResults) reject(errors.failedToRecognize);
                            else resolve(res.body.ParsedResults[0].ParsedText);
                        }
                        if (err)
                        {
                            reject(errors.failedToRecognize);
                        }
                    })
                }
            });
        }

        /*function textRecognize(image, language)
        {
            return new Promise((resolve, reject) =>
            {
                cloudinary.uploader.upload(image,
                    function (result)
                    {
                        let param =
                        {
                            apikey: "bb041811a288957",
                            language: language,
                            url: result.url
                        }
                        needle.request('post', 'https://api.ocr.space/parse/image', param, function(err, res)
                        {
                            if (!err)
                            {
								console.log(res.body.ParsedResults[0].ParsedText);
                                resolve(res.body.ParsedResults[0].ParsedText);
                            }
                            if (err)
                            {
                                reject({ success: false });
                            }
                        })
                    }
            )});
        }*/

        function like(text)
        {
            return new Promise((resolve, reject) =>
            {
                let day = dateFormat(new Date(), 'yyyy-mm-dd');
                yandexRepository.findOne({ where: { date: { $like: day } }, raw: true })
                    .then((data) =>
                    {
                        if(data != null)
                        {
                            yandexRepository.update({ positive_evaluation: data.positive_evaluation + 1 }, { where: { date: { $like: day } } })
                                .then((newdata) =>
                                {
                                    resolve(newdata);
                                })
                                .catch(reject);
                        }
                        else
                        {
                            reject(errors.notFound);
                        }
                    })
            })
        }

        function dislike(text)
        {
            return new Promise((resolve, reject) =>
            {
                let day = dateFormat(new Date(), 'yyyy-mm-dd');
                yandexRepository.findOne({ where: { date: { $like: day } }, raw: true })
                    .then((data) =>
                    {
                        if(data != null)
                        {
                            yandexRepository.update({ negative_evaluation: data.negative_evaluation + 1 }, { where: { date: { $like: day } } })
                                .then((newstat) =>
                                {
                                    resolve(newstat);
                                })
                                .catch(reject);
                        }
                        else
                        {
                            reject(errors.notFound);
                        }
                    })
            })
        }

        function getStatistics(start, finish)
        {
            return new Promise((resolve, reject) =>
            {
                if(start == '' || finish == '' || start == undefined || finish == undefined) reject(errors.nullValue)
                else
                {
                    yandexRepository.findAll({where: { $and: [{date: {gte: start}}, {date: {lte: finish}}]}, order: 'date DESC' })
                        .then((statistics) =>
                        {
                            if (statistics.length != 0)
                            {
                                resolve(statistics);
                            }
                            else
                            {
                                reject(errors.notFound)
                            }
                        })
                        .catch(reject);
                }
            })
        }
    }

    return new YandexService(yandexRepository, errors);
};
