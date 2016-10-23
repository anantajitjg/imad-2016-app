$(function(){
	//logo specific
	var rotate;
	var angle=0;
	var logo=$("#logo");
	function logoRotate(){
		angle=angle+45;
		var rtVal="rotate("+angle+"deg)";
		logo.css({"transform":rtVal,"-webkit-transform":rtVal,"-moz-transform":rtVal,"-ms-transform":rtVal,"-o-transform":rtVal});
		if(angle>=1080){
			clearInterval(rotate);
		}
	}
	logo.mouseover(function(){
		angle=0;
		rotate=setInterval(logoRotate,50);
	});
	logo.mouseout(function(){
		angle=0;
		clearInterval(rotate);
	});
	
	//menu specific
	var menu_btn=$("#menu_btn");
	var menu=$("#menu");
	var menu_state=getCookie("menu_status");
	if(menu_state=="active"){
		menu.css("left","0");
		menu_btn.addClass("active");
	}else{
		menu.css("left","-160px");
		menu_btn.removeClass("active");
	}
	menu_btn.click(function(){
		if(menu_btn.hasClass("active")){
			setCookie("menu_status","off",30);
			menu.animate({left:"-160"},500);
			menu_btn.removeClass("active");
		}else{
			setCookie("menu_status","active",30);
			menu_btn.addClass("active");
			menu.animate({left:"0"},500);
		}
	});
});