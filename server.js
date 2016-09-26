var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={
    'article-one':{
        title:"Article One | Anantajit",
        heading:"Article One",
        content:`<p>This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.</p>`
    },
    'article-two':{
        title:"Article Two | Anantajit",
        heading:"Article Two",
        content:`<p>This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.</p>`
    },
    'article-three':{
        title:"Article Three | Anantajit",
        heading:"Article Three",
        content:`<p>This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.</p>`
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
        <link rel="stylesheet" type="text/css" href="/ui/style.css" />
    </head>
    <body>
        <div id="wrapper">
            <div>
                <a href="/">Home</a>
            </div>
            <hr />
            <h3>${heading}</h3>
            <div>${content}</div>
        </div>
    </body>
</html>`
;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter=0;
app.get('/counter',function(req,res){
    counter=counter+1;
    res.send(counter.toString());
});
var comments=[];
app.get('/submit',function(req,res){
    var comment=req.params.comment;
    comments.push(comment);
    //JSON
    //res.send("test");
    res.send(JSON.stringify(comments));
});
app.get('/:articleID',function(req,res){
    var articleObj=req.params.articleID;
   res.send(createTemplate(articles[articleObj]));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/logo.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'logo.png'));
});
app.get('/ui/bg.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bg.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
