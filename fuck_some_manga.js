// ==UserScript==
// @name         漫画Link爬虫
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Sunjx17
// @match        *://www.ykmh.com/*
// @match        *://www.90mh.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var list_as,hits,tarea;
    if(window.location.href.match(/90mh.com/)!==null){
       list_as=".chapter-body li a";
       hits=".chapter-tip";
       tarea=".chapter-bar";
    }
    else if(window.location.href.match(/ykmh.com/)!==null){
        list_as=".zj_list a";
        hits="#hits";
        tarea=".wrap_intro_l_comic";
    }
    var huas=$(list_as).length;
    var imlinks=[];
    $(hits).text("");
    var success=0;
    $(tarea).eq(0).after('<textarea id="tar" rows="100" cols="200"></textarea>');
    for(var i=0;i<huas;i++){
        $.get($(list_as).eq(i).attr("href"),{},function(ret){
            success++;
            $(hits).text(String(success));
            var v=ret;
            var s=v.match(/var chapterImages( =.+;)var chapterPath/);
            var t=v.match(/\<title\>(.*)\<\/title\>/)[1];
            console.log(t);
            var js0="imlinks[\'"+t+"\']"+s[1];
            eval(js0);
            var imlength=imlinks[t].length;
            var th="'"+t+"'=>[\n";
            for(var j=0;j<imlength;j++){
                th+="\t'"+imlinks[t][j]+"',\n";
            }
            var org=$('#tar').val();
            $("#tar").val(org+th+"],\n");
        })
    }
    // Your code here...
})();