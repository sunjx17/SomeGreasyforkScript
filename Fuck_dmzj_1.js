// ==UserScript==
// @name         DMZJ动漫之家
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Sunjx17
// @match        *://manhua.dmzj.com/*
// @grant        none
// @require      http://localhost:60115/__sources/open_source/open_clipboard_js/dist/clipboard.min.js
// @require      http://localhost:60115/__sources/open_source/open_jquery/jquery.js
// ==/UserScript==

(function() {
    'use strict';
    //*****************************看漫画的时候
    $("#center_box").hide();
    $('.footer').hide();
    $('div.hotrmbox').remove();
    var next_chap=$('#next_chapter').attr('href');
    $('#next_chapter').attr("target","_blank");
    var img_options=$('#page_select option');
    var hrefs='';
    for(var i=0;i<img_options.length;i++){
        hrefs=hrefs+'http:'+img_options.eq(i).attr('value')+'\r\n';
    }
    $('div.funcdiv').eq(0).css({"height":'auto'});
    $('div.funcdiv').eq(0).append('<textarea id="tarea" rows=10 cols=160 ></textarea>');
    $('#tarea').eq(0).css({'z-index':999});
    $('#tarea').val(hrefs);
    $('#tarea').after('<button class="shw_btn">Show</button>');
    $('#tarea').after('<button class="s_btn">Copy</button>');
    $('#tarea').after('<a href="'+next_chap+'" id="ncp">next</a>');
    $('.shw_btn').click(function(){$("#center_box").show();});
    var clipboard = new ClipboardJS('.s_btn', {
        text: function() {

            var hr=$('#tarea').val();
            $('#tarea').val('OK');
            return hr;
        }
    });

    clipboard.on('success', function(e) {
        $('#next_chapter').click();
        $('#ncp').click();
        console.log(e);
    });

    clipboard.on('error', function(e) {
        console.log(e);
    });
    //******************************************************列表部分
    var mytitle=$(".anim_title_text").text();
    $('div.middleright_mr .icorss_acg').remove();
    var as=$('div.middleright_mr').eq(0).find('li>a');
    $('div.middleright_mr').eq(0).before('<div id="ctt"><i id="all"></i><a id="has"></a></div>')
    var all=as.length;
    $('#all').text(String(all));
    var getevs=Array();
    var has=0;
    for(i=0;i<as.length;i++){
        var link=as.eq(i).attr("href");
        $.get(link,function(data){
            var lines=String(data).split("\r\n");
            var evl='';
            var ttl='';
            for(var i=0;i<lines.length;i++){
                var lin=lines[i].replace(/^\s+|\s+$/g, '');
                var ssd=lin.match(/eval\(function/);
                if(ssd!=null){
                    evl=lin.match(/eval\((.+?\))\)$/)[1];
                }
                var stt=lin.match(/\<title\>(\S*)\<\/title\>/);
                if(stt!=null){
                    ttl=stt[1];
                }
            }
            has++;
            $('#has').text(String(has));
            getevs[ttl]=evl;
        });
    }
    $('#has').click(function(){
        if(has==all){
            $('#ctt').append('<div id="ucct"></div>');
            $('#ucct').append('<textarea id="tar" rows="100" cols="200"></textarea>');
            var val0=`<?php
$list=[
`;
            var list=[];
            for(var ttl in getevs){
                var pages="",a="";
                //console.log(getevs[ttl]);
                var b=eval("a="+getevs[ttl]);
                //console.log(b);
                //console.log("a "+a);
                a=a.replace("var pages=","");
                eval(a);
                console.log("pages "+pages);
                var plist=eval(pages);
                var str0=`"${ttl}"=>[
`;
                //var org=$('#tar').val();
                //$('#tar').val(org+ttl+"\r\n");
                for(var i=0;i<plist.length;i++){
                    str0+=`"http://images.dmzj.com/${plist[i]}",
`;
                    // $('#tar').val($('#tar').val()+'http://images.dmzj.com/'+plist[i]+'\r\n');
                 }
                str0+=`],
`;
                list.push(str0);
            }
            list.sort();
            for(var p=0;p<list.length;p++){
                val0+=list[p];
            }
            val0+=`];

$opts = array (
	'http' => array (
	'method' => 'GET',
	'header'=> 'Referer: http://images.dmzj.com/'
	)
);
$org="";
$context = stream_context_create($opts);

foreach($list as $tt =>$ims){
    $tt=preg_replace('/${mytitle}(.+)-.+-.+/','$1',$tt);
	if(!is_dir($tt))mkdir($tt);
	echo $tt,PHP_EOL,"Y/any";
	$yn = trim(fgets(STDIN));
	if($yn==="y" or $yn==="Y")
	foreach($ims as $id=>$im){
		$fn=sprintf("%s/%03d.jpg",$tt,$id);
		if(!is_file($fn)){
			file_put_contents($fn,file_get_contents($org.$im,false,$context));
			echo "\t",$fn,PHP_EOL,"\t\t",$im,PHP_EOL;
		}
		else{
			echo "\tskip",$fn,PHP_EOL,"\t\t",$im,PHP_EOL;
		}
	}
}
`;
            $("#tar").val(val0);
        }
    });
    /*
    function(p,a,c,k,e,d){
        e=function(c){
            return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))
        };
        if(!''.replace(/^/,String)){
            while(c--){
                d[e(c)]=k[c]||e(c)
            }
            k=[function(e){
                return d[e]
            }];
            e=function(){
                return'\\w+'
            }
            ;c=1
        };
        while(c--){
            if(k[c]){
                p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])
            }
        }
        return p
    }
    ('x l=l=\'["m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/C.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/B.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/A.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/z.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/D.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/E.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/I.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/H.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/G.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/F.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/y.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/q.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/p.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/o.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/n.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/r.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/s.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/w.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/v.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/u.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/t.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/J.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/16.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/10.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/Z.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/Y.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/X.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/11.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/12.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/17.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/15.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/14.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/13.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/K.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/W.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/V.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/O.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/N.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/M.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/L.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/P.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/Q.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/U.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/T.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/S.9","m\\/%5%4%3%2%1%8%0%6%g%0%d%1%0%6%b%0%7%a%5%4%3%2%1%8\\/%2%7%k%j%f%e%c%h%i\\/R.9"]\';',62,70,'E5|B3|E6|94|AD|E9|B0|9C|95|jpg|86|8F|E8|A5|88|BB|91|AF|9D|E7|80|pages||015|014|013|012|016|017|021|020|019|018|var|011|004|003|002|001|005|006|010|009|008|007|022|034|040|039|038|037|041|042|046|045|044|043|036|035|027|026|025|024|028|029|033|032|031|023|030'.split('|'),0,{})
    while(has<all){}
    var ttl='';
    for(ttl in getevs){
        console.log(ttl+'\n'+getevs[ttl]);
    }*/

})();
