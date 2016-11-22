var ArticleTemplate=function(){
    var me=this;
    me.create=function(dataObj){
        var id=dataObj.id;
        var title=dataObj.title;
        var date=dataObj.date;
        var content=dataObj.content;
        var htmlTemplate=`<!DOCTYPE html><html lang="en">
        <head>
                    <meta charset="utf-8">
            <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
            <link rel="stylesheet" type="text/css" href="/style.css" />
                    <script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
                    <!--<script type="text/javascript" src="/js/lib/jquery.min.js"></script>-->
        </head>
        <body>
            <div id="wrapper">
                <div class="float_right"><span id="user_area"><button id="login_btn" class="btn_primary"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Login</button></span>&nbsp;&nbsp;<button id="home_trigger" class="btn_primary"><span class="glyphicon glyphicon-home" aria-hidden="true"></span> Home</button></div>
                <div class="clear_fix"></div>
                <h2>${title}</h2>
                            <div class="text-small"><span class='glyphicon glyphicon-calendar' aria-hidden='true'></span> ${date.toDateString()}</div>
                <div class="main_content">${content}</div>
                            <hr />
                            <div id="visiter_message"><strong>Note: </strong><em>You must be logged in to comment or like this article.</em></div>
                            <div>
                                    <button id="likeBtn" class="btn_primary btn_info"><span class="like_icon glyphicon glyphicon-heart" aria-hidden="true"></span> Likes | <span id="like_count">0</span></button>
                            </div>
                            <div id="commentWrapper">
                                <h4>Comments:</h4>
                                <div id="comment_form"></div>
                                <ul id="comment_list"><li><em>No comments to display!</em></li></ul>
                            </div>
            </div>
            <div id="loginWrapper" style="display:none;">
                <div id="login" class="loginInnerWrapper">
                    <div class="login_close"><span class='glyphicon glyphicon-remove-sign' aria-hidden='true'></span></div>
                    <div class="center text-big bold">
                        Login
                    </div>
                    <div class="alert-info">
                        New user? Register <span id="register_trigger" class="link">here</span>
                    </div>
                    <div id="login_message" class="user_message">&nbsp;</div>
                    <div class="flex_table">
                        <form id="login_form" action="#" method="POST">
                            <div class="row">
                                <div class="field">Username:</div><div class="field"><input type="text" name="un" id="login_un" placeholder="Username" required /></div>
                            </div>
                            <div class="row">
                                    <div class="field">Password:</div><div class="field"><input type="password" name="pwd" id="login_pwd" placeholder="Password" required /></div>
                            </div>
                            <div class="row">
                                <div class="field"><input type="submit" id="login_submit" value="Login" class="btn_primary" /></div>
                            </div>
                        </form>
                    </div>
                </div>
                <div id="register" class="loginInnerWrapper">
                    <div class="login_close"><span class='glyphicon glyphicon-remove-sign' aria-hidden='true'></span></div>
                    <div class="center text-big bold">
                        Register
                    </div>
                    <div class="alert-info">
                        Login <span id="login_trigger" class="link">here</span>
                    </div>
                    <div id="register_message" class="user_message">&nbsp;</div>
                    <div class="flex_table">
                        <form id="register_form" action="#" method="POST">
                            <div class="row">
                                <div class="field">Username:</div><div class="field"><input type="text" name="un" id="register_un" placeholder="Username" required /></div>
                            </div>
                            <div class="row">
                                <div class="field">Password:</div><div class="field"><input type="password" name="pwd" id="register_pwd" placeholder="Password" required/></div>
                            </div>
                            <div class="row">
                                <div class="field">Email:</div><div class="field"><input type="email" name="email" id="register_email" placeholder="Email" required /></div>
                            </div>
                            <div class="row">
                                <div class="field"><input type="submit" id="register_submit" value="Register" class="btn_primary" /></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
                    <script type="text/javascript" src="/main.js"></script>
                    <script type="text/javascript" src="/js/user.js"></script>
        </body>
    </html>`
    ;
        return htmlTemplate;
    };
};

module.exports=ArticleTemplate;