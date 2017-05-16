'use strict';
const Sequelize = require('sequelize');
const needle = require("needle");
const validurl = require('valid-url');
const assert = require("assert");
const sinon = require('sinon');
const should = require('should');
const config = require('../config');
const dbcontext = require('../context/db')(Sequelize, config);
const errors = require('../utils/errors');
const Promise = require("bluebird");

let yandexRepository = dbcontext.yandex;
let transltrRepository = dbcontext.transltr;

var yandexService = require('../services/yandex')(yandexRepository, errors);
var transltrService = require('../services/transltr')(transltrRepository, errors);

var translate1 =
{
    text: 'hello',
    from: 'en',
    to: ''
};

var recognize1 =
{
    image: '',
    language: 'rus'
};

var recognize2 =
{
    image: 'http:// savepic.ru/13920638.png',
    language: 'rus'
};

var recognize3 =
{
    image: 'http://savepic.ru/13920638.png',
    language: 'rus'
};

var statistics1 =
{
    number_translations: 1,
    characters_translation: 5,
    positive_evaluation: 0,
    negative_evaluation: 0,
    date: '2017-1-1'
}

var statistics2 =
{
    number_translations: 1,
    characters_translation: 5,
    positive_evaluation: 0,
    negative_evaluation: 1,
    date: '2017-1-1'
}

var statistics3 =
{
    number_translations: 1,
    characters_translation: 5,
    positive_evaluation: 1,
    negative_evaluation: 0,
    date: '2017-1-1'
}

var statistics4 =
{
    number_translations: 1,
    characters_translation: 5,
    positive_evaluation: 1,
    negative_evaluation: 0,
    date: '2017-1-1'
}

var info1 =
{
    start: '',
    finish: '2017-05-09'
}

var info2 =
{
    start: '2017-01-01',
    finish: '2017-01-01'
}

var info3 =
{
    start: '2017-05-10',
    finish: '2017-05-09'
}

var sandbox;
beforeEach(function ()
{
    sandbox = sinon.sandbox.create();
});

afterEach(function ()
{
    sandbox.restore();
});

describe('Сервис yandex', ()=>
{
    describe('Функция translate', () =>
    {
        it('Отдавать ошибку при undefined и пустом значении', () =>
        {
            sandbox.stub(needle, 'request').returns(Promise.resolve());
            let promise = yandexService.translate(translate1.text, translate1.from, translate1.to);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.nullValue.status);
            })
        });
    });
    describe('Функция textRecognize', () =>
    {
        it('Отдавать ошибку при undefined и пустом значении', () =>
        {
            sandbox.stub(needle, 'request').returns(Promise.resolve());
            let promise = yandexService.textRecognize(recognize1.image, recognize1.language);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.nullValue.status);
            })
        });
        it('Отдавать ошибку при невалидном url', () =>
        {
            sandbox.stub(validurl, 'isUri').returns(false);
            let promise = yandexService.textRecognize(recognize2.image, recognize2.language);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.invalidUrl.status);
            })
        });
    });
    describe('Функция like', () =>
    {
        it('Отдавать ошибку при несуществующей сущности', () =>
        {
            sandbox.stub(yandexRepository, 'findOne').returns(Promise.resolve(null));
            let promise = yandexService.like();
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.notFound.status);
            })
        });
        it('Отдавать объект при изменении', () =>
        {
            sandbox.stub(yandexRepository, 'findOne').returns(Promise.resolve(statistics1));
            sandbox.stub(yandexRepository, 'update').returns(Promise.resolve(statistics2));
            let promise = yandexService.like();
            return promise.then((result)=>
            {
                result.should.be.an.Object();
            })
        });
    });
    describe('Функция dislike', () =>
    {
        it('Отдавать ошибку при несуществующей сущности', () =>
        {
            sandbox.stub(yandexRepository, 'findOne').returns(Promise.resolve(null));
            let promise = yandexService.dislike();
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.notFound.status);
            })
        });
        it('Отдавать объект при изменении', () =>
        {
            sandbox.stub(yandexRepository, 'findOne').returns(Promise.resolve(statistics3));
            sandbox.stub(yandexRepository, 'update').returns(Promise.resolve(statistics4));
            let promise = yandexService.dislike();
            return promise.then((result)=>
            {
                result.should.be.an.Object();
            })
        });
    });
    describe('Функция getStatistics', () =>
    {
        it('Отдавать ошибку при undefined и пустом значении', () =>
        {
            sandbox.stub(yandexRepository, 'findAll').returns(Promise.resolve());
            let promise = yandexService.getStatistics(info1.start, info1.finish);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.nullValue.status);
            })
        });
        it('Отдавать ошибку при несуществующей сущности', () =>
        {
            sandbox.stub(yandexRepository, 'findAll').returns(Promise.resolve({}));
            let promise = yandexService.getStatistics(info2.start, info2.finish);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.notFound.status);
            })
        });
        it('Отдавать массив объектов', () =>
        {
            sandbox.stub(yandexRepository, 'findAll').returns(Promise.resolve([statistics1]));
            let promise = yandexService.getStatistics(info3.start, info3.finish);
            return promise.then((result)=>
            {
                result.should.be.an.Array;
            })
        });
    });
})

describe('Сервис transltr', ()=>
{
    describe('Функция translate', () =>
    {
        it('Отдавать ошибку при undefined и пустом значении', () =>
        {
            sandbox.stub(needle, 'request').returns(Promise.resolve());
            let promise = transltrService.translate(translate1.text, translate1.from, translate1.to);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.nullValue.status);
            })
        });
    });
    describe('Функция textRecognize', () =>
    {
        it('Отдавать ошибку при undefined и пустом значении', () =>
        {
            sandbox.stub(needle, 'request').returns(Promise.resolve());
            let promise = transltrService.textRecognize(recognize1.image, recognize1.language);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.nullValue.status);
            })
        });
        it('Отдавать ошибку при невалидном url', () =>
        {
            sandbox.stub(validurl, 'isUri').returns(false);
            let promise = transltrService.textRecognize(recognize2.image, recognize2.language);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.invalidUrl.status);
            })
        });
    });
    describe('Функция like', () =>
    {
        it('Отдавать ошибку при несуществующей сущности', () =>
        {
            sandbox.stub(transltrRepository, 'findOne').returns(Promise.resolve(null));
            let promise = transltrService.like();
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.notFound.status);
            })
        });
        it('Отдавать объект при изменении', () =>
        {
            sandbox.stub(transltrRepository, 'findOne').returns(Promise.resolve(statistics1));
            sandbox.stub(transltrRepository, 'update').returns(Promise.resolve(statistics2));
            let promise = transltrService.like();
            return promise.then((result)=>
            {
                result.should.be.an.Object();
            })
        });
    });
    describe('Функция dislike', () =>
    {
        it('Отдавать ошибку при несуществующей сущности', () =>
        {
            sandbox.stub(transltrRepository, 'findOne').returns(Promise.resolve(null));
            let promise = transltrService.dislike();
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.notFound.status);
            })
        });
        it('Отдавать объект при изменении', () =>
        {
            sandbox.stub(transltrRepository, 'findOne').returns(Promise.resolve(statistics3));
            sandbox.stub(transltrRepository, 'update').returns(Promise.resolve(statistics4));
            let promise = transltrService.dislike();
            return promise.then((result)=>
            {
                result.should.be.an.Object();
            })
        });
    });
    describe('Функция getStatistics', () =>
    {
        it('Отдавать ошибку при undefined и пустом значении', () =>
        {
            sandbox.stub(transltrRepository, 'findAll').returns(Promise.resolve());
            let promise = transltrService.getStatistics(info1.start, info1.finish);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.nullValue.status);
            })
        });
        it('Отдавать ошибку при несуществующей сущности', () =>
        {
            sandbox.stub(transltrRepository, 'findAll').returns(Promise.resolve({}));
            let promise = transltrService.getStatistics(info2.start, info2.finish);
            return promise.catch((err)=>
            {
                err.status.should.be.equal(errors.notFound.status);
            })
        });
        it('Отдавать массив объектов', () =>
        {
            sandbox.stub(transltrRepository, 'findAll').returns(Promise.resolve([statistics1]));
            let promise = transltrService.getStatistics(info3.start, info3.finish);
            return promise.then((result)=>
            {
                result.should.be.an.Array;
            })
        });
    });
})
