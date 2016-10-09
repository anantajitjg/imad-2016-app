document.body.onload=function(){
	//logo specific
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
	//menu specific
	var menu_btn=document.getElementById("menu_btn");
	var menu=document.getElementById("menu");
	var slt;
	var left=-160;
	var active=false;
	function slide(){
		if(left==-160){
			active=false;
			menu_btn.className+=" active";
		}else if(left==0){
			active=true;
			menu_btn.className="btn_primary";
		}
		if(active){
			left+=-10;
		}else{
			left+=10;	
		}
		if(left==0||left==-160){
			clearInterval(slt);	
		}
		menu.style.left=left+"px";
	}
	menu_btn.onclick=function(){
		if(left==0||left==-160){
			slt=setInterval(slide,10);	
		}
	};
};
