/*===================================================================
波文字マウス　Ripple Text　by Kurt Grigg - http://www.btinternet.com/~kurt.grigg/javascript（閉鎖済）
掲載サイト：http://www.kurtsdhtml.talktalk.net/　　★ソースを簡略化。文字色ランダム指定追加　2016/08/16
虹色ランダム指定参考サイト：http://www.mf2fm.com/rv （Tinkerbell Magic Sparkle ）
====================================================================*/
(function (){  //即時関数で囲んでグローバル変数を消すため、この行はこのままで

var msg = "ビタ金ナイトヒーハー！！！";//★マウスストーカー用文字指定。お好みで

var colour="random"; //★文字色指定。左記の"random"の項目に色名を記述すると記述した１色になる。「random」指定なら下記も指定
//★「1は赤系統のランダム」「2は緑系統のランダム」「3は青系統のランダム」「4は虹色のランダム」「5は灰色のランダム」。上記単色指定の時は「0」
var r_mode=1;

var fs=70;           //★文字の大きさ。単位px
var sc=0.8;          //★マウスが静止した時の文字同士の間隔
var ft="HGS創英角ポップ体";   //★原本arial。文字の書体。指定しない時は var ft="";で
var delay=0.35;      //★原本0.35。文字のゆらゆら度。1未満で指定。Must be less than 1
var speed=40;        //★原本40。文字の速度。setTimeout - run speed
var hy=30;           //★マウスと文字の先頭の上下の距離。マイナスで文字が上
var hx=0;          　//★マウスと文字の先頭の左右の距離。マイナスで文字が左
/*★↓文字の影指定をCSS形式で記述。見本は黒の輪郭線指定。好みで変更可。指定不要ならvar fcss="";で*/
var fcss="text-shadow:1px 1px 1px #000;";

//指定ここまで End user config.--------------------------------------------------
msg=msg.split("");
var n=msg.length;
var y=0, x=0, yp=[], xp=[], yd=[], xd=[], temp=[], scy=0, scx=0, i=0;
for (i=0; i<n; i++){
document.write("<span id='letters"+i+"' style='z-index:10;position:absolute;font-size:"+fs+"px;font-family:"+ft+";"+fcss+"'>"+msg[i]+"<\/span>");
}
document.onmousemove=function(e){ y=e.pageY+hy; x=e.pageX+hx;}
function assign(){
var h=window.pageYOffset+window.innerHeight-fs-hy-18;//無限落下停止用
for(i=0; i<n; i++){ temp[i].top =Math.min(h, yp[i])+'px'; temp[i].left=xp[i]+(i*(fs*sc))+'px';}
}
function ripple(){
yp[0]=yd[0]+=(y-yd[0]) * delay;
xp[0]=xd[0]+=(x-xd[0]) * delay;
for(var i=1; i<n; i++){
yp[i] = yd[i]+=(yp[i-1] - yd[i]) * delay;
xp[i] = xd[i]+=(xp[i-1] - xd[i]) * delay;
}
assign(); setTimeout(ripple,speed);
}
function newColour() {   /*■文字色指定追加*/
var c=[Math.floor(Math.random()*256),Math.floor(Math.random()*256)];
if(r_mode===1){return("rgb(255,"+c[0]+","+c[1]+")");}//赤
else if(r_mode===2){return ("rgb("+c[0]+",255,"+c[1]+")");}//緑
else if(r_mode===3){return ("rgb("+c[0]+","+c[1]+",255)");}//青
else if(r_mode===4){
var cc=[];
cc[0]=255;
cc[1]=Math.floor(Math.random()*256);
cc[2]=Math.floor(Math.random()*(256-cc[1]/2));
cc.sort(function(){return (0.5-Math.random());});
return ("rgb("+cc[0]+","+cc[1]+","+cc[2]+")");}//虹色
else if(r_mode===5){return ("rgb("+c[0]+","+c[0]+","+c[0]+")");}//灰色
else if(r_mode===0){document.getElementById("letters"+i).style.color=colour;}
}
function init(){
for (i=0; i<n; i++){
yp[i]=xp[i]=yd[i]=xd[i]=0;
temp[i]=document.getElementById("letters"+i).style;
temp[i].color=(colour=="random")?newColour():colour;//■文字色指定追加
}
ripple();
}
init();
}());
