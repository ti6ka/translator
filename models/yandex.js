'use strict';
module.exports = (Sequelize, sequelize) =>
{
    return sequelize.define('yandex',
    {
        id:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        number_translations: Sequelize.INTEGER,
        characters_translation: Sequelize.INTEGER,
        positive_evaluation: Sequelize.INTEGER,
        negative_evaluation: Sequelize.INTEGER,
        date: Sequelize.STRING
    });
};
