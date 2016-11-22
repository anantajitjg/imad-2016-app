var DBConfig=function(){
  var me=this;
  me.setup={
      dev:{
		user: 'postgres',
		database: 'imad',
		host: '127.0.0.1',
		port: '5432',
		password: process.env.PGDB_PASSWORD
	},
	prod:{
		user: 'anantajitjg',
		database: 'anantajitjg',
		host: 'db.imad.hasura-app.io',
		port: '5432',
		password: process.env.DB_PASSWORD
	}
  };
};

module.exports=DBConfig;


