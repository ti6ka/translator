'use strict';
function changeLanguage()
{
    var from = document.getElementById('languageFrom').value;
    var to = document.getElementById('languageTo').value;
    $('#languageFrom').val(to);
    $('#languageTo').val(from);
}

function errorRecognize(message)
{
    $("#errorrecognize").empty();
    $("#errorrecognize").append('<strong>Ошибка!</strong> ' + message);
}

function recognize()
{
    var language = document.getElementById('languageImage').value;
    var image = document.getElementById('urlImage').value;
    if(image == '') errorRecognize('Введите ссылку на изображение.');
    else
    {
        var rec =
        {
            image: image,
            language: language
        };
        $.ajax(
            {
                type: "post",
                data: rec,
                url: "/api/transltr/image",
                dataType: "json",
                success: function(data)
                {
                    $("#before").val(data);
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'invalid_url') errorRecognize('Неверный URL изображения.');
                    if(error.responseJSON.code == 'failed_to_recognize') errorRecognize('Не удалось распознать текст. Проверьте правильность ссылки на изображение.');
                }
            });
    }
}

function errorTranslateYandex(message)
{
    $("#errortranslateyandex").empty();
    $("#errortranslateyandex").append('<strong>Ошибка!</strong> ' + message);
}

function translateYandex()
{
    var text = document.getElementById('before').value;
    var from = document.getElementById('languageFrom').value;
    var to = document.getElementById('languageTo').value;
    if(text == '') errorTranslateYandex('Введите текст.');
    else
    {
        var transl =
        {
            text: text,
            from: from,
            to: to
        };
        $.ajax(
            {
                type: "post",
                data: transl,
                url: "/api/yandex/text",
                dataType: "json",
                success: function(data)
                {
                    $("#yandexText").val(data);
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'null_value') errorTranslateYandex('Заполните все поля.');
                    if(error.responseJSON.code == 'failed_translation') errorTranslateYandex('Не удалось перевести текст.');
                }
            });
    }
}

function errorTranslateTransltr(message)
{
    $("#errortranslatetransltr").empty();
    $("#errortranslatetransltr").append('<strong>Ошибка!</strong> ' + message);
}

function translateTransltr()
{
    var text = document.getElementById('before').value;
    var from = document.getElementById('languageFrom').value;
    var to = document.getElementById('languageTo').value;
    if(text == '') errorTranslateTransltr('Введите текст');
    else
    {
        var transl =
        {
            text: text,
            from: from,
            to: to
        };
        $.ajax(
            {
                type: "post",
                data: transl,
                url: "/api/transltr/text",
                dataType: "json",
                success: function(data)
                {
                    $("#transltrText").val(data);
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'null_value') errorTranslateTransltr('Заполните все поля.');
                    if(error.responseJSON.code == 'failed_translation') errorTranslateTransltr('Не удалось перевести текст.');
                }
            });
    }
}

function errorLikeYandex(message)
{
    $("#errorlikeyandex").empty();
    $("#errorlikeyandex").append('<strong>Ошибка!</strong> ' + message);
}

function likeYandex()
{
    var text = document.getElementById('yandexText').value;
    var dat =
    {
        text: text
    }
    if (text == '') errorLikeYandex('Вы ничего не перевели.');
    else
    {
        $.ajax(
            {
                type: "post",
                data: dat,
                url: "/api/yandex/like",
                success: function()
                {
                    alert('Спасибо:)');
                    $('#yandexText').val('');
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'entity_not_found') errorLikeYandex('Не найдена сущность.');
                }
            });
    }
}

function dislikeYandex()
{
    var text = document.getElementById('yandexText').value;
    var dat =
    {
        text: text
    }
    if (text == '') errorLikeYandex('Вы ничего не перевели.');
    else
    {
        $.ajax(
            {
                type: "post",
                data: dat,
                url: "/api/yandex/dislike",
                success: function()
                {
                    alert('Жаль что вам не понравилось:(');
                    $('#yandexText').val('');
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'entity_not_found') errorLikeYandex('Не найдена сущность.');
                }
            });
    }
}

function errorLikeTransltr(message)
{
    $("#errorlikeyandex").empty();
    $("#errorlikeyandex").append('<strong>Ошибка!</strong> ' + message);
}

function likeTransltr()
{
    var text = document.getElementById('transltrText').value;
    var dat =
    {
        text: text
    }
    if (text == '') errorLikeTransltr('Вы ничего не перевели');
    else
    {
        $.ajax(
            {
                type: "post",
                data: dat,
                url: "/api/transltr/like",
                success: function()
                {
                    alert('Спасибо:)');
                    $('#transltrText').val('');
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'entity_not_found') errorLikeTransltr('Не найдена сущность.');
                }
            });
    }
}

function dislikeTransltr()
{
    var text = document.getElementById('transltrText').value;
    var dat =
    {
        text: text
    }
    if (text == '') errorLikeTransltr('Вы ничего не перевели');
    else
    {
        $.ajax(
            {
                type: "post",
                data: dat,
                url: "/api/transltr/dislike",
                success: function()
                {
                    alert('Жаль что вам не понравилось:(');
                    $('#transltrText').val('');
                },
                error: function(error)
                {
                    if(error.responseJSON.code == 'entity_not_found') errorLikeTransltr('Не найдена сущность.');
                }
            });
    }
}

function yandexStatistics()
{
    var date = new Date();
    var now = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    var info =
    {
        start: now,
        finish: now
    };
    $.ajax(
    {
        type: "post",
        data: info,
        url: "/api/yandex/statistics",
        dataType: "json",
        success: function(data)
        {
            var mt = '<h4>Яндекс</h4><input type="date" id="start" value="2017-01-01"> - <input type="date" id="finish" value="2017-01-01"> <button type="button" class="btn btn-primary" onclick="showStatYandex()">Показать</button>';
            var mb = '<table class="table"><thead><th>Дата</th><th>Переводов</th><th>Символов</th><th>Лайков</th><th>Дизлайков</th></thead><tbody>';
                for (var i = 0; i < data.length; i++) {
                    mb += '<tr><td>' + data[i].date.replace('T00:00:00.000Z', '') + '</td>' +
                        '<td>' + data[i].number_translations + '</td>' +
                        '<td>' + data[i].characters_translation + '</td>' +
                        '<td>' + data[i].positive_evaluation + '</td>' +
                        '<td>' + data[i].negative_evaluation + '</td></tr>';
                }
                mb += '</tbody></table>';
            $(".modal-title").html(mt);
            $(".modal-body").html(mb);
        },
        error: function(error)
        {
            mb = '<h4>Ничего не найдено</h4>';
            $(".modal-body").html(mb);
        }
    });
}

function showStatYandex()
{
    var start = document.getElementById('start').value;
    var finish = document.getElementById('finish').value;
    var info =
    {
        start: start,
        finish: finish
    }
    $.ajax(
        {
            type: "post",
            data: info,
            url: "/api/yandex/statistics",
            dataType: "json",
            success: function(data)
            {
                var mt = '<h4>Яндекс</h4><input type="date" id="start" value="2017-05-09"> - <input type="date" id="finish" value="2017-05-15"> <button type="button" class="btn btn-primary" onclick="showStatYandex()">Показать</button>';
                var mb = '<table class="table"><thead><th>Дата</th><th>Переводов</th><th>Символов</th><th>Лайков</th><th>Дизлайков</th></thead><tbody>';
                    for (var i = 0; i < data.length; i++) {
                        mb += '<tr><td>' + data[i].date.replace('T00:00:00.000Z', '') + '</td>' +
                            '<td>' + data[i].number_translations + '</td>' +
                            '<td>' + data[i].characters_translation + '</td>' +
                            '<td>' + data[i].positive_evaluation + '</td>' +
                            '<td>' + data[i].negative_evaluation + '</td></tr>';
                    }
                    mb += '</tbody></table>';
                mb += '</tbody></table>';
                $(".modal-title").html(mt);
                $(".modal-body").html(mb);
            },
            error: function(error)
            {
                mb = '<h4>Ничего не найдено</h4>';
                $(".modal-body").html(mb);
            }
        });
}

function transltrStatistics()
{
    var date = new Date();
    var now = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    var info =
    {
        start: now,
        finish: now
    };
    $.ajax(
    {
        type: "post",
        data: info,
        url: "/api/transltr/statistics",
        dataType: "json",
        success: function(data)
        {
            var mt = '<h4>Transltr</h4><input type="date" id="start" value="2017-01-01"> - <input type="date" id="finish" value="2017-01-01"> <button type="button" class="btn btn-primary" onclick="showStatTransltr()">Показать</button>';
            var mb = '<table class="table"><thead><th>Дата</th><th>Переводов</th><th>Символов</th><th>Лайков</th><th>Дизлайков</th></thead><tbody>';
            for (var i = 0; i < data.length; i++)
            {
                mb += '<tr><td>' + data[i].date.replace('T00:00:00.000Z', '') + '</td>' +
                          '<td>' + data[i].number_translations +'</td>' +
                          '<td>' + data[i].characters_translation + '</td>' +
                          '<td>' + data[i].positive_evaluation + '</td>' +
                          '<td>' + data[i].negative_evaluation + '</td></tr>';
            }
            mb += '</tbody></table>';
            $(".modal-title").html(mt);
            $(".modal-body").html(mb);
        },
        error: function(error)
        {
            mb = '<h4>Ничего не найдено</h4>';
            $(".modal-body").html(mb);
        }
    });
}

function showStatTransltr()
{
    var start = document.getElementById('start').value;
    var finish = document.getElementById('finish').value;
    var info =
    {
        start: start,
        finish: finish
    }
    $.ajax(
        {
            type: "post",
            data: info,
            url: "/api/transltr/statistics",
            dataType: "json",
            success: function(data)
            {
                var mt = '<h4>Transltr</h4><input type="date" id="start" value="2017-05-09"> - <input type="date" id="finish" value="2017-05-15"> <button type="button" class="btn btn-primary" onclick="showStatTransltr()">Показать</button>';
                var mb = '<table class="table"><thead><th>Дата</th><th>Переводов</th><th>Символов</th><th>Лайков</th><th>Дизлайков</th></thead><tbody>';
                for (var i = 0; i < data.length; i++) {
                    mb += '<tr><td>' + data[i].date.replace('T00:00:00.000Z', '') + '</td>' +
                        '<td>' + data[i].number_translations + '</td>' +
                        '<td>' + data[i].characters_translation + '</td>' +
                        '<td>' + data[i].positive_evaluation + '</td>' +
                        '<td>' + data[i].negative_evaluation + '</td></tr>';
                }
                mb += '</tbody></table>';
                mb += '</tbody></table>';
                $(".modal-title").html(mt);
                $(".modal-body").html(mb);
            },
            error: function(error)
            {
                mb = '<h4>Ничего не найдено</h4>';
                $(".modal-body").html(mb);
            }
        });
}

