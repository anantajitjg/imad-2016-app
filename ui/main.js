console.log('Loaded!');
var logo=document.getElementById("logo");
var rotate;
var angle=0;
function logoRotate(){
	angle=angle+45;
	logo.style.transform="rotate("+angle+"deg)";
	if(angle==1080){
		clearInterval(rotate);
	}
}
logo.onmouseover=function(){
	angle=0;
	rotate=setInterval(logoRotate,50);
};
logo.onmouseout=function(){
	angle=0;
	clearInterval(rotate);
};
//comments
var comment=document.getElementById("comment");
var submit_comment=document.getElementById("submit_comment");
var comment_list=document.getElementById("comment_list");
submit_comment.onclick=function(){
    var comment_value=comment.value;
    //console.log(comment_value);
  var request=new XMLHttpRequest();
  request.onreadystatechange=function(){
    if(request.readyState===XMLHttpRequest.DONE){
        if(request.status===200){
            var comments=JSON.parse(request.responseText);
            //var comments=request.responseText;
            var list="";
            for(var i=0;i<comments.length;i++){
                list+="<li>"+comments[i]+"</li>";
            }
            comment_list.innerHTML=list;
        }
    }  
  };
  request.open("GET","http://anantajitjg.imad.hasura-app.io/submit?comment="+comment_value,true);
  request.send();
};