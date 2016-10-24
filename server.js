var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var config={
    user: 'anantajitjg',
    database: 'anantajitjg',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
var pool=new Pool(config);

var articles={
    'personal':{
		id:"2",
        title:"Personal | Anantajit",
		date:'21/09/2016',
        heading:"Personal",
        content:`<p>Personal information.</p>`
    },
    'education':{
		id:"3",
        title:"Education | Anantajit",
		date:'21/09/2016',
        heading:"Education",
        content:`<p>Information about my Education</p>`
    },
    'experience':{
		id:"4",
        title:"Experience | Anantajit",
		date:'21/09/2016',
        heading:"Experience",
        content:`<p>My Experience</p>`
    },
    'skills':{
		id:"5",
        title:"Skills | Anantajit",
		date:'21/09/2016',
        heading:"Skills",
        content:`<p>My Skills</p>`
    }
};

function createTemplate(dataObj){
	var id=dataObj.id;
    var title=dataObj.title;
	var date=dataObj.date;
    var heading=dataObj.heading;
    var content=dataObj.content;
    var htmlTemplate=`<!DOCTYPE html><html>
    <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel='shortcut icon' type='image/x-icon' href='favicon.ico' />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>
    <body>
        <div id="wrapper">
            <div class="float_right">
                <a href="/" class="btn_primary"><span class="glyphicon glyphicon-home" aria-hidden="true"></span> Home</a>
            </div>
			<div class="clear_fix"></div>
            <h2>${heading}</h2>
			<div class="text-small"><span class='glyphicon glyphicon-calendar' aria-hidden='true'></span> ${date}</div>
            <div>${content}</div>
			<hr />
			<div>
				<button id="likeBtn" class="btn_primary btn_info" data-id="${id}"><span class="glyphicon glyphicon-heart" aria-hidden="true" style="font-size:1.5em;top:4px"></span> <span id="like_status">Like</span> | <span id="count">0</span></button>
			</div>
			<div>
				<h5>Comments:</h5>
				<textarea id="comment" rows="5" cols="50"></textarea><br />
				<input type="submit" id="submit_comment" value="Submit Comment" class="btn_primary" />
				<input type="hidden" value="${id}" id="article_id" />
				<strong id="loader_comments"><span class='glyphicon glyphicon-comment' aria-hidden='true'></span> Loading...</strong>
				<ul id="comment_list">
				</ul>
			</div>
        </div>
		<script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="main.js"></script>
    </body>
</html>`
;
return htmlTemplate;
}
//loading static files
app.use(express.static(path.join(__dirname, 'ui')));

//testing db
app.get('/test-db',function(req,res){
    pool.query("SELECT * FROM test",function(err,result){
        if(err){
            res.status(500).send("Error: "+err.toString());
        }else{
            res.send(JSON.stringify(result));
        }
    });
});

//like button specific
var counter={id:[],likes:[]};
app.get('/counter',function(req,res){
	var pgId=req.query.id;
	var inc=req.query.inc;
	if(counter.id.indexOf(pgId)==-1){
		for(var i=0;i<pgId;i++){
			if(counter.id.indexOf((i+1).toString())==-1){
				counter.id.push((i+1).toString());
				counter.likes.push(0);
			}
		}
	}
	counter.id.sort();
	if(inc==1){
		counter.likes[pgId-1]=counter.likes[pgId-1]+1;
	}
	res.send(JSON.stringify(counter));
});
//comments specific
function timeValidate(unit){
	if(unit<10){
		unit="0"+unit;
	}
	return unit;
}
var comments={id:[],content:[],date:[]};
app.get('/submit',function(req,res){
	var id=req.query.id;
    var comment=req.query.comment;
	comments.id.push(id);
    comments.content.push(comment);
	var dateObj=new Date();
	var hours=dateObj.getHours(),minutes=dateObj.getMinutes(),seconds=dateObj.getSeconds();
	var date=dateObj.getDate()+"/"+(dateObj.getMonth()+1)+"/"+dateObj.getFullYear()+" "+timeValidate(hours)+":"+timeValidate(minutes)+":"+timeValidate(seconds);
	if(hours<12){
		date+=" AM";
	}else{
		date+=" PM";
	}
	comments.date.push(date);
    res.send(JSON.stringify(comments));
});
//articles specifc
app.get('/:articleID',function(req,res){
    var articleObj=req.params.articleID;
   res.send(createTemplate(articles[articleObj]));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
