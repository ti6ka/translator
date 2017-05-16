'use strict';
module.exports = (Sequelize, config) =>
{
    const options =
    {
        host: config.db.host,
        dialect: 'mysql',
        logging: false,
        define:
        {
            timestamps: true,
            paranoid: true,
            defaultScope:
            {
                where:
                {
                    deletedAt:
                    {
                        $eq: null
                    }
                }
            }
        }
    };

    const options_pg =
    {
        host: config.production.host,
        dialect: 'postgres',
        logging: true,
        define:
        {
            timestamps: true,
            paranoid: true,
            defaultScope:
            {
                where:
                {
                    deletedAt: { $eq: null }
                }
            }
        }
    };

    var sequelize;

    if(process.env.NODE_ENV === 'production')
    {
        sequelize = new Sequelize(config.production.name, config.production.user, config.production.password, options_pg);
    }
    else
    {
        sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, options);
    }

    const Yandex = require('../models/yandex')(Sequelize, sequelize);
    const Transltr = require('../models/transltr')(Sequelize, sequelize);

    return { yandex: Yandex, transltr: Transltr, sequelize: sequelize };
};
