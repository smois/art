var height=screen.availHeight  //screen.height;
var width=screen.width;
var descript_height=height*0.55+"px";
var foot=height-100+"px";
var timer; 
  
//теперь картины
function fill_paint_list(){
var artist_id = $("#artist").val();
var sel = document.getElementById("paint");
sel.length=0;
$.getJSON( "paints/paints_of_artist_"+artist_id+".json", function( data ) {
  for(var i=0;i<data.paints.length;i++){
	sel.options[i]= new Option(data.paints[i].name, data.paints[i].id);
	  }
	});

// привязка события выбора картины
$( "#paint" ).off( "change" );//сначала отвязываем предыдущее событие, чтобы не выполнялось несколько раз.
$( "#paint" ).change(function() {
  get_descript_p( "paints_desc/paint_"+$("#paint :selected").val()+".json" );
  //картинка
  var filename="JPG/Kar"+$("#paint :selected").val()+".jpg";
  $("#stamp_p").attr("src",filename);
  //стрелку меняем на "увеличить"
 	$("#arrow").attr("src","images/arrl.png");$("#arrow").attr("title","Увеличить");  
	});

//теперь загружаем картину-марку
setTimeout(function(){  
var filename="JPG/Kar"+$("#paint :selected").val()+".jpg";
  $.getJSON("paints_desc/paint_"+$("#paint :selected").val()+".json", function(data){
  $("#paint_year").html(data.year);	
	  }
  );
  $("#stamp_p").attr("src",filename);
	},1000);

}

function get_descript_p(filename){
  $("#descript").attr("value","paint"); //меняем значение атрибута, чтобы не обновлять многократно
  $.getJSON(filename, function(data){
	$("#descript").html(data.descript);
  	$("#paint_year").html(data.year);	
	  }
  );
}

//смена марки на фото - теперь для картины
function change_picture_p(){
//меняем описание художника на описание картины
if ($("#descript").attr("value")=="artist") {
var desc_file="paints_desc/paint_"+$("#paint").val()+".json";
$.getJSON(desc_file, function(data){
	$("#descript").html(data.descript);
	$("#paint_year").html(data.year);	
    }
  );
	$("#descript").attr("value","paint"); //меняем значение атрибута, чтобы не обновлять многократно
	}

var srcfile = $("#stamp_p").attr("src");
var sub = srcfile.substr(4, 1);
var filename = (sub=="I")?"JPG/Kar"+$("#paint :selected").val()+".jpg":"JPG/IKar"+$("#paint :selected").val()+".jpg";
var title = (sub=="I")?"Щелкни, чтобы увидеть репродукцию":"Щелкни, чтобы увидеть марку";
$("#stamp_p").attr("src",filename);
$("#stamp_p").attr("title",title);
}
//смена марки на фото - для увеличенной картины
function change_picture_p_large(){
var filename;
var srcfile = $("#large_pict").attr("src");
var sub = srcfile.substr(4, 1);
//$("#large_pict").resizable("destroy");
if (sub=="I") {$( "#large_pict" ).attr("height","");	
filename = "JPG/Kar"+$("#paint :selected").val()+".jpg";
}
else {$( "#large_pict" ).attr("height","");
filename = "JPG/IKar"+$("#paint :selected").val()+".jpg";
}
var title = (sub=="I")?"Щелкни, чтобы увидеть репродукцию":"Щелкни, чтобы увидеть марку";
$("#large_pict").attr("src",filename);
$("#large_pict").attr("title",title);
}
function resize_picture(){
	$(function() {
    $( "#large_pict" ).resizable({
      aspectRatio: true,
	  containment:"#for_desc"
		});
	});		
}
//марка всегда есть, если нет картинки, возвращаем марку
function no_picture_p(){
var srcfile = $("#stamp_p").attr("src");
if (srcfile.match(/.*undefined.jpg/)) {//если что-то не подгрузилось
                return;
            }
srcfile=srcfile.replace("/I","/");
$("#stamp_p").attr("src",srcfile);
$("#stamp_p").attr("title","");
console.log('no_picture_p', srcfile);
return;
}

function menu_about(){
$("aside").hide();
//Выводим рекст из файла описания
$.get('brief.txt', function(data) {
$("#descript").html(data);   
});
$("#for_desc").css("margin-left","21%");
}
function menu_artist(){ //сгенерить случайный id, выбрать в списке художника с эти id и загрузить его БИО
$("aside").show(); //показать боковые панели
var i=parseInt($("select[id=artist] option").size()*Math.random());  //*
$("#artist :nth-child("+i+")").attr("selected", "selected");
var filename="artists/artist_"+$("#artist :selected").val()+".json";
get_descript(filename);
$("#descript").attr("value","artist");

//картинка
filename="JPG/Xud"+$("#artist :selected").val()+".jpg";
$("#stamp").attr("src",filename);
}
// список художников
function fill_list(){
var sel = document.getElementById("artist");
$.getJSON( "artists.json", function( data ) {var j=0;
  for(var i=0;i<data.artists.length;i++){ //console.log(data.artists[i].name);
	if (data.artists[i].name.substr(0,11)!="Неизвестный")
	{j++;
	sel.options[j]= new Option(data.artists[i].name, data.artists[i].id);
	}
  }
});
// привязка события выбора художника 
$( "#artist" ).change(function() {
  $("#descript").attr("value","artist");	
  get_descript( "artists/artist_"+$("#artist").val()+".json" );
  //картинка
  var filename="JPG/Xud"+$("#artist :selected").val()+".jpg";
  $("#stamp").attr("src",filename);
  //Восстанавливаем размеры картины
	$("#stamp_p").attr("width","225px");$("#stamp_p").attr("align","top");
	$("#arrow").attr("src","images/arrl.png");$("#arrow").attr("title","Увеличить"); 

});

//При загрузке выбираем художника случайным образом; 
//срабатывает только с задержкой: проверить величину задержки на хосте
setTimeout(function(){menu_artist();}, 1000);
}

function get_descript(filename){
	$("#descript").html("");
    $.getJSON(filename, function(data){
	$("#descript").html(data.descript);
    if (filename.substr(0,6)=="artist") $("#life").html(data.birth+" - "+((data.death==0)?'':data.death));	
//
    }
  );

//наполняем список картин
if (filename.substr(0,6)=="artist") {
	fill_paint_list();
	}
}

//смена марки на фото
function change_picture(){
//меняем описание картины на художника
if ($("#descript").attr("value")!="artist") {
var desc_file="artists/artist_"+$("#artist").val()+".json";
$("#arrow").attr("src","images/arrl.png");$("#arrow").attr("title","Увеличить"); 
$.getJSON(desc_file, function(data){
	$("#descript").html(data.descript);
//  if (filename.substr(0,6)=="artist") $("#life").html(data.birth+" - "+((data.death==0)?'':data.death));	
    }
  );
	$("#descript").attr("value","artist"); //меняем значение атрибута, чтобы не обновлять многократно
	}
var srcfile = $("#stamp").attr("src");
var sub = srcfile.substr(4, 1);
var filename = (sub=="I")?"JPG/Xud"+$("#artist :selected").val()+".jpg":"JPG/IXud"+$("#artist :selected").val()+".jpg";
var title = (sub=="I")?"Щелкни, чтобы увидеть репродукцию":"Щелкни, чтобы увидеть марку";
$("#stamp").attr("src",filename);
$("#stamp").attr("title",title);
}
//если нет марки, ставим картинку; если нет и картинки - заглушку
function no_picture(){
var srcfile = $("#stamp").attr("src");
            //чтобы не грузило картинку, если ее нет, добавим проверку
            if (srcfile.match(/.*noimages.png/)) {
                return;
            }
console.log('no_picture ', srcfile);
var sub = srcfile.substr(4, 1);
srcfile=(sub!="I")?srcfile.replace("/","/I"):"JPG/noimages.png";
$("#stamp").attr("src",srcfile);
$("#stamp").attr("title","");

}

function enlarge()
{
  if ($("#arrow").attr("src")=="images/arrl.png")
  {
	$("#descript").html("<img id='large_pict' onclick='change_picture_p_large();' width='100%' src='"+$("#stamp_p").attr("src")+"'>");
	$("#descript").attr("value","paint");
	
	$("#arrow").attr("src","images/arrr.png");$("#arrow").attr("title","Уменьшить");
	$("#buttonResize").html("<a href='#' title='Щелкните, чтобы менять размеры изображения мышью.' onclick='resize_picture();'>Размер</a>")
	
  }
  else
  {
	var desc_file="paints_desc/paint_"+$("#paint").val()+".json";
	$.getJSON(desc_file, function(data){
	$("#descript").html(data.descript);

    }
  );
	$("#descript").attr("value","paint"); //меняем значение атрибута, чтобы не обновлять многократно
	$("#arrow").attr("src","images/arrl.png");$("#arrow").attr("title","Увеличить"); 
	$("#buttonResize").html("&nbsp;")
	}
  
}
