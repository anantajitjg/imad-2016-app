var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={
    'personal':{
        title:"Personal | Anantajit",
        heading:"Personal",
        content:`<p>Personal information.</p>`
    },
    'education':{
        title:"Education | Anantajit",
        heading:"Education",
        content:`<p>Information about my Education</p>`
    },
    'experience':{
        title:"Experience | Anantajit",
        heading:"Experience",
        content:`<p>My Experience</p>`
    },
    'skills':{
        title:"Skills | Anantajit",
        heading:"Skills",
        content:`<p>My Skills</p>`
    }
};

function createTemplate(dataObj){
    var title=dataObj.title;
    var heading=dataObj.heading;
    var content=dataObj.content;
    var htmlTemplate=`<html>
    <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/ui/style.css" />
    </head>
    <body>
        <div id="wrapper">
            <div class="float_right">
                <a href="/" class="btn_primary"><span class="glyphicon glyphicon-home" aria-hidden="true"></span> Home</a>
            </div>
			<div class="clear_fix"></div>
            <h3>${heading}</h3>
            <div>${content}</div>
			<hr />
			<div>
				<h5>Comments:</h5>
				<textarea id="comment" rows="5" cols="50"></textarea><br />
				<input type="submit" id="submit_comment" value="Submit Comment" class="btn_primary" />
				<ul id="comment_list">
				</ul>
			</div>
        </div>
		<script type="text/javascript" src="/ui/main.js"></script>
    </body>
</html>`
;
return htmlTemplate;
}

app.use('/fonts', express.static(__dirname + '/ui/fonts/'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/', 'favicon.ico'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/ui/home.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home.js'));
});
app.get('/ui/logo.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img/', 'logo.png'));
});
app.get('/ui/bg.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/img/', 'bg.png'));
});
function timeValidate(unit){
	if(unit<10){
		unit="0"+unit;
	}
	return unit;
}
var comments={content:[],date:[]};
app.get('/submit',function(req,res){
    var comment=req.query.comment;
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
app.get('/:articleID',function(req,res){
    var articleObj=req.params.articleID;
   res.send(createTemplate(articles[articleObj]));
});
var counter=0;
app.get('/counter',function(req,res){
    counter=counter+1;
    res.send(counter.toString());
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
