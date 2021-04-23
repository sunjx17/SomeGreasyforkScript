// ==UserScript==
// @name         byrbt赠送
// @version      1.0.0
// @author       camedeus
// @description  byrbt赠送
// @icon         https://bt.byr.cn/favicon.ico
// @match        *://bt.byr.cn/*
// @grant        none
// @namespace    camedeus/bubt
// ==/UserScript==
'use strict';
/*                 *
 *   简易参数设定   *
 *                 */

window.addEventListener('load', function() {
    var onc=$("#thankbutton25").attr("onclick");
    if(onc!=undefined){
        var ma=onc.match(/(\d+),(\d+),(\d+\.\d+)/);
        var a1=parseInt(ma[1]);
        var a2=ma[2];
        var a3=parseFloat(ma[3]);
        // onclick="givebonusfunbox(2616,500,215250.6);"
        if ($("#thanksbutton50").length <= 0) {
            $("#curuserbonus").prev().prev().empty();
            $("#curuserbonus").prev().prev().html(`
						<input type="number" size="20" id="thanknumber" value=500>
						<input class="btn" type="button" id="thankbutton" value="GIVE">
						`);
        }
        else {
            $("#thanksbutton50").empty();
            $("#thanksbutton50").html(`
						<input type="number" size="20" id="thanknumber">
						<input class="btn" type="button" id="thankbutton" value="GIVE">
						`);
                        }
        $("#thankbutton").click(function(){
            var thanknum=parseFloat($("#thanknumber").val());
            givebonusfunbox(a1,thanknum,a3);
        });
    }
    var cm = document.querySelector("iframe[src='shoutbox.php?type=shoutbox']");
    if(cm!=undefined)cm.height=600;
    //var e = document.querySelector("iframe[src='fun.php?action=view']")
    //var a = e.contentDocument.querySelectorAll('.shoutrow')[1].querySelectorAll('img')
    //e.height=600
    // a = e.contentquerySelectorAll('.shoutrow')[1].querySelector('img')
    /*for(var i=0;i<a.length;i++){
        var x = a[i].src
        if(x.match('thumb.jpg')){
            a[i].src = x.substring(0,x.length-10)
        }
    }*/
}, false);
