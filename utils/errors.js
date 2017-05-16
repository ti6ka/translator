'use strict';
const express = require('express');

express.response.error = function(error)
{
    if (!error.code)
    {
        error =
        {
            message: error.toString(),
            code: 'server_error',
            status: 500
        };
    }
    this.status(error.status).json(error);
};

module.exports =
{
    nullValue:
    {
        message: 'Null value',
        code: 'null_value',
        status: 400
    },
    invalidUrl:
    {
        message: 'Invalid url',
        code: 'invalid_url',
        status: 400
    },
    failedToRecognize:
    {
        message: 'Failed to recognize',
        code: 'failed_to_recognize',
        status: 401
    },
    failedTranslation:
    {
        message: 'Failed translation',
        code: 'failed_translation',
        status: 402
    },
    notFound:
    {
        message: 'Entity not found',
        code: 'entity_not_found',
        status: 404
    }
};