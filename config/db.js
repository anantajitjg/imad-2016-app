const url = require('url');

var DBConfig = function() {
    var me = this;
    me.setup = function(env) {
        var envConfig = {};
        if (env === 'prod') {
            const params = url.parse(process.env.DATABASE_URL);
            const auth = params.auth.split(':');
            envConfig = {
                user: auth[0],
                password: auth[1],
                host: params.hostname,
                port: params.port,
                database: params.pathname.split('/')[1],
                ssl: true
            };
        } else {
            envConfig = {
                user: 'postgres',
                database: 'imad',
                host: '127.0.0.1',
                port: '5432',
                password: process.env.PGDB_PASSWORD
            };
        }
        return envConfig;
    };
};

module.exports = DBConfig;
