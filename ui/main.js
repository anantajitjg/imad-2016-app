//console.log('Loaded!');
//comments specific
var comment=document.getElementById("comment");
var submit_comment=document.getElementById("submit_comment");
var comment_list=document.getElementById("comment_list");
submit_comment.onclick=function(){
    var comment_value=comment.value;
	if(comment_value.length>0){
		comment.style.outline="none";
		var request=new XMLHttpRequest();
		comment_list.innerHTML="<li><h4><span class='glyphicon glyphicon-comment' aria-hidden='true'></span> Loading Comments...</h4></li>";
		request.onreadystatechange=function(){
		if(request.readyState===XMLHttpRequest.DONE){
			if(request.status===200){
				var comments=JSON.parse(request.responseText);
				var list="";
				for(var i=0;i<comments.content.length;i++){
					if(comments.content[i]!==null){
						list+="<li><span class='glyphicon glyphicon-comment' aria-hidden='true'></span> "+comments.content[i]+"<br /><span class='glyphicon glyphicon-time' aria-hidden='true'></span> "+comments.date[i]+"</li>";
					}
				}
				comment_list.innerHTML=list;
			}
		}  
		};
		request.open("GET","/submit?comment="+comment_value,true);
		request.send();
	}else{
		comment.focus();
		comment.style.outline="1px solid #d57171";
	}
};