// ==UserScript==
// @name         bilibili精简首页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili delect some!
// @require      http://localhost:60115/__sources/open_source/open_jquery/jquery.js
// @author       sunjx17
// @include      *://www.bilibili.com/
// @include      *://www.bilibili.com/?*
// @include      *://www.bilibili.com/read/cv*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function home(){
        var i=0;
        var sz1=jq('.list-box .item').length;
        var sz2=jq('.proxy-box > div').length;
        if(sz2<20 | sz1<22){
            setTimeout(home,1000);
            return;
        }
        var presv_rlist=[1,2,3,4,5,15];
        for(i=sz1-1;i>=0;i--){
            console.log(i+" "+jq('.list-box .item').eq(i).text());
            if(jq.inArray(i,presv_rlist)==-1){
                console.log('del '+i);
                jq('.list-box .item').eq(i).remove();
            }
        }
        for(i=sz2-1;i>=0;i--){
            console.log("s"+i+"  " + jq('.proxy-box > div').eq(i).attr("id"));
            if(jq.inArray(i,presv_rlist)==-1){
                console.log('del '+i);
                jq('.proxy-box > div').eq(i).remove();
            }
        }
        jq('#bili_report_spe_rec').remove();
    }
    function cv(){
    }
    var jq=jQuery.noConflict();
    var matchlist={
        homepage1:{
            preg:/https:\/\/www\.bilibili\.com/i,func:home
         },
        homepage2:{
            preg:/https:\/\/www\.bilibili\.com\/\?.+/i,func:home
         }
     };


    for(var t in matchlist){
        if(window.location.href.search(matchlist[t].preg)>=0){
            console.log("match"+t);
            jq(document).ready(matchlist[t].func);
            break;
        }
    }
    // Your code here...
})();