'use strict';
var needle = require("needle");
var Promise = require("bluebird");
Promise.promisifyAll(needle);
var cloudinary = require('cloudinary');
var dateFormat = require('dateformat');
var validurl = require('valid-url');
var urlparse = require('url-parse');

cloudinary.config
({
    cloud_name: 'dw79kpjkq',
    api_key: '531891264239351',
    api_secret: 'vr9hWCi2p3y1WrPa9ZyiwgvUIr4'
});

module.exports = (transltrRepository, errors) =>
{
    function TransltrService(transltrRepository, errors)
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
                        text: text,
                        from: from,
                        to: to
                    }
                    needle.request('post', 'http://www.transltr.org/api/translate', param, function(err, res)
                    {
                        if (!err)
                        {
                            var day = dateFormat(new Date(), 'yyyy-mm-dd');
                            transltrRepository.findOne({where: {date_transl: {$like: day}}, raw: true})
                                .then((statistic) =>
                                {
                                    if (statistic === null)
                                    {
                                        let statistics =
                                        {
                                            number_translations: 1,
                                            characters_translation: text.length,
                                            positive_evaluation: 0,
                                            negative_evaluation: 0,
                                            date_transl: day
                                        };
                                        transltrRepository.create(statistics);
                                    }
                                    else
                                    {
                                        let newstatistics =
                                        {
                                            number_translations: statistic.number_translations + 1,
                                            characters_translation: statistic.characters_translation + text.length
                                        };
                                        transltrRepository.update(newstatistics, {where: {date: {$like: day}}});
                                    }
                                })
                            resolve(res.body.translationText);
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
                transltrRepository.findOne({ where: { date_transl: { $like: day } }, raw: true })
                    .then((data) =>
                    {
                        if(data != null)
                        {
                            transltrRepository.update({ positive_evaluation: data.positive_evaluation + 1 }, { where: { date_transl: { $like: day } } })
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
                transltrRepository.findOne({ where: { date_transl: { $like: day } }, raw: true })
                    .then((data) =>
                    {
                        if(data != null)
                        {
                            transltrRepository.update({ negative_evaluation: data.negative_evaluation + 1 }, { where: { date_transl: { $like: day } } })
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

        function getStatistics(start, finish)
        {
            return new Promise((resolve, reject) =>
            {
                if(start == '' || finish == '' || start == undefined || finish == undefined) reject(errors.nullValue)
                else
                {
                    transltrRepository.findAll({where: { $and: [{date_transl: {gte: start}}, {date_transl: {lte: finish}}]}, order: 'date_transl DESC' })
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

    return new TransltrService(transltrRepository, errors);
};
