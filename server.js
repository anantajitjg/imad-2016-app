var express = require('express');
var morgan = require('morgan');
var path = require('path');
var ArticleTemplate = require('./template/article');
var DBConfig = require('./config/db');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
//session specific
app.use(session({
	secret: 'AjIMADWebApplicationOfYear2016',
	cookie: {maxAge: 1000*60*60*24*30},
	resave: true,
	saveUninitialized: true
}));
//db specific
var dbconfig=new DBConfig();
var pool=new Pool(dbconfig.setup.prod);
//template specific
var articleTemplate=new ArticleTemplate();
//login specific
function pwd_hash(password,salt){
	var key=crypto.pbkdf2Sync(password,salt,10000,512,'sha512');
	return ["pbkdf2","10000",salt,key.toString('hex')].join("$");
}
function pwd_verify(password,hash){
	var salt=hash.split("$")[2];
	var hashedPassword=pwd_hash(password,salt);
	if(hashedPassword===hash){
		return true;
	}
	return false;
}
function get_auth_status(req){
    var status="";
    if(req.session && req.session.userAuth && req.session.userAuth.id && req.session.userAuth.role){
        status=req.session.userAuth.role;
    }
    return status;
}
app.post("/login",function(req,res){
   var username=req.body.un;
   var password=req.body.pwd;
   pool.query("SELECT * FROM users WHERE username=$1",[username],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           if(result.rows.length===0){
               res.status(403).send("Username/Password is invalid!");
           }else{
               var db_pass=result.rows[0].password;
               if(pwd_verify(password,db_pass)){
                   req.session.userAuth={id:result.rows[0].id,role:result.rows[0].role};
                   res.send(result.rows[0].role);
               }else{
                   res.status(403).send("Username/Password is invalid!");
               }
           }
       }
   });
});
app.post("/register",function(req,res){
   var username=req.body.un;
   var password=req.body.pwd;
   var email=req.body.email;
   var salt = crypto.randomBytes(128).toString('hex');
   var hashed_pwd= pwd_hash(password,salt);
   pool.query("INSERT INTO users(username,password,email) VALUES($1,$2,$3)",[username,hashed_pwd,email],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           res.send("Successfully Registered!");
       }
   });
});
app.get("/get-auth",function(req,res){
    if(get_auth_status(req)!==""){
        pool.query("SELECT username FROM users WHERE id=$1",[req.session.userAuth.id],function(err,result){
            if(err){
                res.status(500).send(err.toString());
            }else{
                res.send(result.rows[0].username);
            }
        });
    }else{
        res.status(400).send("Not logged in!");
    }
});
app.get("/logout",function(req,res){
	delete req.session.userAuth;
        res.sendFile(path.join(__dirname, "ui", "logout.html"));
});
//admin specific routes
app.get('/admin',function(req,res){
    if(get_auth_status(req)!=="admin"){
        res.redirect("/");
    }else{
        res.sendFile(path.join(__dirname, "ui/admin/", "index.html"));
    }
});
app.get('/admin/:page',function(req,res){
    if(get_auth_status(req)!=="admin"){
        res.redirect("/");
    }else{
        res.sendFile(path.join(__dirname, "ui/admin/", req.params.page+".html"));
    }
});
//like button specific
app.get('/like-article/:articleName',function(req,res){
  if(get_auth_status(req)!==""){
        var articleName=req.params.articleName;
        var userId=req.session.userAuth.id;
        pool.query("SELECT * FROM article WHERE article_name=$1",[articleName],function(err,result){
            if(err){
                res.status(500).send(err.toString());
            }else{
                if(result.rows.length===0){
                    res.status(404).send("No article found!");
                }else{
                    var articleId=result.rows[0].id;
                    pool.query("INSERT INTO likes(article_id, user_id) VALUES($1, $2)",[articleId,userId],function(err,result){
                        if(err){
                            res.status(500).send("Not allowed to like more than once!");
                        }else{
                            res.status(200).send("Liked");
                        }
                    });
                }
            }
        });
    }else{
        res.status(403).send("Please login to like article!");
    }  
});
app.get('/get-likes/:articleName',function(req,res){
    var likes={count:0,status:""};
    var articleName=req.params.articleName;
    pool.query("SELECT COUNT(likes.*) FROM article,likes WHERE article.article_name=$1 AND article.id=likes.article_id GROUP BY likes.article_id",[articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length!==0){
                likes.count=result.rows[0].count;
                if(get_auth_status(req)!==""){
                    var userId=req.session.userAuth.id;
                    pool.query("SELECT users.username FROM article,users,likes WHERE article.article_name=$1 AND article.id=likes.article_id AND likes.user_id=$2",[articleName,userId],function(err,result){
                        if(err){
                            res.status(500).send(err.toString());
                        }else{
                            if(result.rows.length===0){
                                likes.status="not liked";
                            }else{
                                likes.status="liked";
                            }
                            res.status(200).send(JSON.stringify(likes));
                        }
                    });
                }else{
                    res.status(200).send(JSON.stringify(likes));
                }
            }else{
                res.send(JSON.stringify(likes));
            }
        }
    });
});
//comments specific
app.post('/submit-comment/:articleName',function(req,res){
    if(get_auth_status(req)!==""){
        var articleName=req.params.articleName;
        var comment=req.body.comment;
        var userId=req.session.userAuth.id;
        pool.query("SELECT * FROM article WHERE article_name=$1",[articleName],function(err,result){
            if(err){
                res.status(500).send(err.toString());
            }else{
                if(result.rows.length===0){
                    res.status(404).send("No article found!");
                }else{
                    var articleId=result.rows[0].id;
                    pool.query("INSERT INTO comments(article_id, user_id, comment) VALUES($1, $2, $3)",[articleId,userId,comment],function(err,result){
                        if(err){
                            res.status(500).send(err.toString());
                        }else{
                            res.status(200).send("Comment successfully inserted!");
                        }
                    });
                }
            }
        });
    }else{
        res.status(403).send("Please login to comment!");
    }
});
app.get("/get-comment/:articleName",function(req,res){
    var articleName=req.params.articleName;
    pool.query("SELECT comments.comment,comments.comment_date,users.username FROM article,comments,users WHERE article.article_name=$1 AND article.id=comments.article_id AND comments.user_id=users.id ORDER BY comments.comment_date DESC",[articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});
//articles specifc
app.get("/blog",function(req,res){
   res.sendFile(path.join(__dirname, "ui/", "blog.html")); 
});
app.post('/add-page',function(req,res){
    if(get_auth_status(req)==="admin"){
        var articleTitle=req.body.title;
        var articleName=(articleTitle.replace(/\s+/g,"-")).toLowerCase();
        var article=req.body.content;
        var articleType=req.body.type;
        if(articleType==="blog"){
            article=article+"<div class='blog_link'><a href='/blog' title='Return to blog'>Return to Blog</a></div>";
        }
        pool.query("INSERT INTO article(title,date,article_name,content,article_type) VALUES($1,now(),$2,$3,$4)",[articleTitle,articleName,article,articleType],function(err,result){
           if(err){
               res.status(500).send("Error: "+err.toString());
           }else{
               res.status(200).send("Successfully added!");
           }
        });
    }else{
        res.status(403).send("Not authorized!");
    }
});
app.post('/update-page',function(req,res){
    if(get_auth_status(req)==="admin"){
        var article=req.body.content;
        var articleID=req.body.id;
        pool.query("UPDATE article SET content=$1 WHERE id=$2",[article,articleID],function(err,result){
           if(err){
               res.status(500).send("Error: "+err.toString());
           }else{
               res.status(200).send("Successfully Updated!");
           }
        });
    }else{
        res.status(403).send("Not authorized!");
    }
});
app.get('/get-articles',function(req,res){
    pool.query("SELECT title,article_name FROM article ORDER By date DESC",function(err,result){
       if(err){
           res.status(500).send("Error: "+err.toString());
       }else{
           if(result.rows.length===0){
               res.status(404).send("Not Found!");
           }else{
                res.send(JSON.stringify(result.rows));
           }
       }
    });
});
app.get('/get-article',function(req,res){
    var articleName=req.query.articleName;
    pool.query("SELECT * FROM article WHERE article_name=$1",[articleName],function(err,result){
       if(err){
           res.status(500).send("Error: "+err.toString());
       }else{
           if(result.rows.length===0){
               res.status(404).send("Not Found!");
           }else{
                res.send(JSON.stringify(result.rows));
           }
       }
    });
});
app.get('/blog-posts',function(req,res){
    pool.query("SELECT * FROM article WHERE article_type='blog' ORDER BY date DESC",function(err,result){
       if(err){
           res.status(500).send("Error: "+err.toString());
       }else{
           if(result.rows.length===0){
               res.status(404).send("Not Found!");
           }else{
                for(var i=0;i<result.rows.length;i++){
                    var content=result.rows[i].content;
                    result.rows[i].content=content.substr(content.indexOf("<p>"),content.indexOf("</p>")+4);
                }
                res.send(JSON.stringify(result.rows));
           }
       }
    });
});
app.get('/articles/:articleName',function(req,res){
    var artName=req.params.articleName;
    pool.query("SELECT * FROM article WHERE article_name=$1",[artName],function(err,result){
       if(err){
           res.status(500).send("Error: "+err.toString());
       }else{
           if(result.rows.length===0){
               res.status(404).sendFile(path.join(__dirname, 'ui', '404.html'));
           }else{
               var artData=result.rows[0];
               res.send(articleTemplate.create(artData));
           }
       }
    });
});
//menu specific
app.get('/menu',function(req,res){
    pool.query("SELECT title,article_name FROM article WHERE article_type='main' ORDER BY id",function(err,result){
       if(err){
           res.status(500).send("Error: "+err.toString());
       }else{
           if(result.rows.length===0){
                res.status(404).send("Not Found!");
           }else{
                var menu_data=result.rows;
                res.send(JSON.stringify(menu_data));
           }
       }
    });
});
//loading static files
app.use(express.static(path.join(__dirname, 'ui')));

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
