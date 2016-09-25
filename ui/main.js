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