var articleName;
//menu specific
function getMenuDetails(){
    var menu_nav=$("#menu_nav");
    if(menu_nav.length>0){
        $.getJSON(rootURL+"/menu",function(data){
                $("#loader_menu").fadeOut('fast',function(){
                        for(var i=0;i<data.length;i++){
                                menu_nav.append("<li class='menu_title' style='display:none;'><a href='"+rootURL+"/articles/"+data[i].article_name+"'>"+data[i].title+"</a></li>");
                        }
                        menu_nav.append("<li class='menu_title' style='display:none;'><a href='"+rootURL+"/blog'>Blog</a></li>");
                        menu_nav.find(".menu_title").fadeIn(500);
                });
        });
    }
}
//likes specific
function submitLike(){
    var likeBtn=$("#likeBtn");
    likeBtn.click(function(){
        $.get(rootURL+"/like-article/"+articleName).done(function(){
            getLikes();
            $(this).off("click").addClass("active");
            $(".like_icon").hide().fadeIn();
        }).fail(function(){
            $(this).off("click");
        });
    });
}
function getLikes(){
    $.getJSON(rootURL+"/get-likes/"+articleName).done(function(data){
        $("#like_count").text(data.count);
        if(data.status==="liked"){
            $("#likeBtn").off("click").addClass("active");
        }
    });
}
//comments specific
function displayComments(){
    var comment_list=$("#comment_list");
    var comments_loader=$("#loader_comments");
    comments_loader.show();
    $.getJSON(rootURL+"/get-comment/"+articleName).done(function(data){
        if(data.length>0){
            var list="";
            for(var i=0;i<data.length;i++){
                var comment_date=new Date(data[i].comment_date);
                list+="<li><div class='comment_message'><span class='glyphicon glyphicon-comment' aria-hidden='true'></span> "+escapeHtml(data[i].comment)+"</div><div class='comment_detail'><span class='glyphicon glyphicon-user' aria-hidden='true'></span> "+escapeHtml(data[i].username)+"&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-calendar' aria-hidden='true'></span> "+comment_date.toDateString()+"&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-time' aria-hidden='true'></span> "+comment_date.toLocaleTimeString()+"</div></li>";
            }
            comment_list.html(list);
        }
    }).fail(function(){
            comment_list.html("<li><div class='alert-error'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Error loading comments!<div></li>");
    }).always(function(){
        comments_loader.fadeOut("slow");
    });
}
function displayCommentsForm(){
    var content=`<textarea id="comment" placeholder="your comments here..." rows="3"></textarea><br />
              <input type="submit" id="submit_comment" value="Submit Comment" class="btn_primary" />
              <strong id="loader_comments"><span class='glyphicon glyphicon-comment' aria-hidden='true'></span> Loading...</strong>`;
    $("#comment_form").html(content);
    $("#commentWrapper").show();
    var comment=$("#comment");
    var submit_comment=$("#submit_comment");
    submit_comment.click(function(){
            var comment_value=comment.val();
            if(comment_value.length>0){
                var data=JSON.stringify({comment: comment_value});
                comment.css("outline","none");
                $.ajax({
                    method: "POST",
                    url: rootURL+"/submit-comment/"+articleName,
                    data: data,
                    contentType: "application/json"
                 }).done(function(res){
                     comment.val("");
                     displayComments();
                 }).fail(function(xhr){
                     $("#comment_list").html("<li><div class='alert-error'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Error: Could not submit comment!<div></li>");
                 });
            }else{
                    comment.focus();
                    comment.css("outline","1px solid #9b302e");
            }
    });
}
//get authenticated user details
function getAuthUserDetails(){
    $.get(rootURL+"/get-auth").done(function(res){
        displayUser(res);
        var commentWrapper=$("#commentWrapper");
        if(commentWrapper){
            $("#visiter_message").remove();
            submitLike();
            displayCommentsForm();
        }
        var loginWrapper=$("#loginWrapper");
        if(loginWrapper){
            loginWrapper.remove();
        }
    });
}
$(function(){
        articleName=window.location.pathname.split('/')[2];
        getAuthUserDetails();
        getMenuDetails();
        if(articleName){
            getLikes();
            displayComments();
        }
        //home button
        var home_trigger=$("#home_trigger");
        if(home_trigger){
            home_trigger.click(function(){
               window.location="/"; 
            });
        }
        //login specific
        var loginbtn=$("#login_btn");
        if(loginbtn){
            loginbtn.click(function(){
                $("#login").css("display","block");
                $("#register").css("display","none");
                $("#loginWrapper").fadeIn(function(){
                    $("#login_un").focus();
                });
            });
        }
        var loginWrapper=$("#loginWrapper");
        if(loginWrapper){
            loginWrapper.click(function(e){
                if(e.target.id=="loginWrapper"){
                    $(this).hide();
                }
            });
        }
        var reg_trigger=$("#register_trigger");
        if(reg_trigger){
            reg_trigger.click(function(){
                $("#login").fadeOut(function(){
                    $("#register").fadeIn();
                    var reg_submit=$("#register_submit");
                    reg_submit.prop("disabled",false);
                    reg_submit.css("cursor","pointer");
                    reg_submit.val("Register");
                    $("#register_un").focus();
                    $("#register_message").css("visibility","hidden");
                    $("#login_form")[0].reset();
                });
            });
        }
        var lgn_trigger=$("#login_trigger");
        if(lgn_trigger){
            lgn_trigger.click(function(){
                $("#register").fadeOut(function(){
                    $("#login").fadeIn();
                    $("#login_un").focus();
                    $("#login_message").css("visibility","hidden");
                    $("#register_form")[0].reset();
                });
            });
        }
        var login_close=$(".login_close");
        if(login_close){
            login_close.click(function(){
                $("#loginWrapper").hide();
                $("#login_form")[0].reset();
                $("#register_form")[0].reset();
            });
        }
        var lgn_form=$("#login_form");
        if(lgn_form){
            var lgn_submit=$("#login_submit");
            var lgn_message=$("#login_message");
            lgn_form.submit(function(e){
                e.preventDefault();
                lgn_submit.val("Wait..");
                var data=JSON.stringify($(this).serializeObject());
                $.ajax({
                   method: "POST",
                   url: rootURL+"/login",
                   data: data,
                   contentType: "application/json"
                }).done(function(res){
                    if(res==="admin"){
                        window.location="/admin";
                    }else{
                        window.location.reload();
                    }
                }).fail(function(xhr){
                    lgn_submit.val("Login");
                    if(xhr.status===400){
                        lgn_message.css("visibility","visible").html("<div class='alert-error'>Please provide valid values then try again!</div>");
                    }else{
                        lgn_message.css("visibility","visible").html("<div class='alert-error'>"+xhr.responseText+"</div>");
                    }
                });
            });
        }
        var reg_form=$("#register_form");
        if(reg_form){
            var reg_submit=$("#register_submit");
            var reg_message=$("#register_message");
            reg_form.submit(function(e){
                e.preventDefault();
                reg_submit.val("Wait...");
                var data=JSON.stringify($(this).serializeObject());
                $.ajax({
                   method: "POST",
                   url: rootURL+"/register",
                   data: data,
                   contentType: "application/json"
                }).done(function(res){
                    reg_submit.val("Registered!");
                    reg_submit.prop("disabled",true);
                    reg_submit.css("cursor","not-allowed");
                    reg_message.css("visibility","visible").html("<div class='alert-success'>"+res+"</div>");
                }).fail(function(xhr){
                    reg_submit.val("Register");
                    if(xhr.status===400){
                        reg_message.css("visibility","visible").html("<div class='alert-error'>Please provide valid values then try again!</div>");
                    }else{
                        reg_message.css("visibility","visible").html("<div class='alert-error'>Username or Email already exist! Fail to register the user!</div>");
                    }
                });
            });
        }
        //blog specific
        var blog_content=$("#blog_content");
        if(blog_content.length>0){
            $.getJSON(rootURL+"/blog-posts").done(function(data){
                if(data.length>0){
                    var list="";
                    for(var i=0;i<data.length;i++){
                        var post_date=new Date(data[i].date);
                        var article=$(data[i].content).text();
                        var article_link=rootURL+"/articles/"+data[i].article_name;
                        list+="<div class='blog_post_wrapper'><div class='blog_headings'><a href='"+article_link+"'>"+data[i].title+"</a></div><div class='post_date'>"+post_date.toDateString()+"</div><div class='blog_posts'>"+article+"........<a href='"+article_link+"'>more&gt;&gt;</a></div></div>";
                    }
                    $(".blogLoader").fadeOut(function(){
                        blog_content.html(list);
                    });
                }
            }).fail(function(){
                    blog_content.html("<li><div class='alert-error'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Fail to load blog posts!<div></li>");
            });
        }
	//skill specific
	var prg=$(".prg_value");
	if(prg){
		prg.each(function(){
			var _this=$(this);
			var prg_value=Math.round(((_this.width()/_this.parent().width())*100)*100)/100;
			$(this).css("width","0").animate({width:prg_value+"%"},1200,function(){
				$(".prg_text").fadeIn();
			});
		});
	}
});