$(function(){
	var rootURL=window.location.protocol+"//"+window.location.host;//http://anantajitjg.imad.hasura-app.io
	console.log(rootURL);
	//get menu details
	var menu=$("#menu ul");
	getMenuDetails();
	function getMenuDetails(){
		$.getJSON(rootURL+"/menu",function(data){
			$("#loader_menu").fadeOut('fast',function(){
				for(var i=0;i<data.length;i++){
					menu.append("<li class='menu_title' style='display:none;'><a href='"+rootURL+"/articles/"+data[i].title+"'>"+data[i].heading+"</a></li>");
				}
				menu.find(".menu_title").fadeIn(500);
			});
		});
	}
	//like button specific
	var likeBtn=$("#likeBtn");
	getLikes();
	function getLikes(incrmnt){
		var pgId=likeBtn.data("id");
		if(typeof incrmnt==="undefined"){
			incrmnt=0;
		}
		$.getJSON(rootURL+"/likes",{id:pgId,inc:incrmnt},function(data){
			$("#count").text(data.likes[pgId]);
		});
	}
	likeBtn.click(function(){
		getLikes(1);
		$(this).off("click").addClass("active");
		var icon=likeBtn.find(".glyphicon");
		icon.hide();
		icon.css("color","#F27793").fadeIn();
	});
	//comments specific
	var comment=$("#comment");
	var submit_comment=$("#submit_comment");
	var comment_list=$("#comment_list");
	var comments_loader=$("#loader_comments");
	submit_comment.click(function(){
		var comment_value=comment.val();
		if(comment_value.length>0){
			var article_id=$("#article_id").val();
			comment.css("outline","none");
			comments_loader.show();
			$.getJSON(rootURL+"/submit",{id:article_id,comment:comment_value}).done(function(comments){
				if(comments.content){
					comments_loader.fadeOut("slow");
					var list="";
					for(var i=comments.content.length-1;i>=0;i--){
						if(comments.id[i]==article_id){
							list+="<li><span class='glyphicon glyphicon-comment' aria-hidden='true'></span> "+escapeHtml(comments.content[i])+"<div class='text-small'><span class='glyphicon glyphicon-time' aria-hidden='true'></span> "+escapeHtml(comments.date[i])+"</div></li>";
						}
					}
					comment_list.html(list);
				}
			}).fail(function(){
				comments_loader.fadeOut("slow");
				comment_list.html("<li><div class='alert-error'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> Error loading comments!<div></li>");
			});
		}else{
			comment.focus();
			comment.css("outline","1px solid #9b302e");
		}
	});
});

//functions for managing cookies
function setCookie(n, v, t) {
    var d = new Date();
    d.setTime(d.getTime() + (t*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = n + "=" + v + ";" + expires + ";path=/";
}
function getCookie(n) {
    var name = n + "=";
    var arr = document.cookie.split(';');
    for(var i = 0; i < arr.length; i++) {
        var c = arr[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//escape html
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
}