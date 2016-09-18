var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articleOne={
    title:"Article One | Anantajit",
    heading:"Article One",
    content:`<p>This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is article.This is</p>`
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
app.get('/article-one',function(req,res){
   res.send(createTemplate(articleOne));
});
app.get('/article-two',function(req,res){
   res.sendFile(path.join(__dirname,'ui','article-two.html'));
});
app.get('/article-three',function(req,res){
   res.sendFile(path.join(__dirname,'ui','article-three.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
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
