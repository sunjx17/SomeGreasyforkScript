// ==UserScript==
// @name         解除DMZJ部分漫画的屏蔽
// @namespace    DMZJManga@dmzj.com
// @version      1.2.6
// @description  解除动漫之家部分漫画的屏蔽状态
// @author       Timesient,tency-Edit by sunjx17
// @match        https://manhua.dmzj.com/*
// @match        http://manhua.dmzj.com/*
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/lazyload@2.0.0-rc.2/lazyload.js
// @require      http://localhost:60115/__sources/open_source/open_jquery/jquery.js
// ==/UserScript==

(function(comicId, comicName, comicFirstLetter, lastChapterId, lastChapterName, lazyload) {
    'use strict';
    //自己加的
    $('div.middleright_mr').eq(0).before('<div id="ctt2"><i id="all2"></i><a id="has2">0</a></div>')
    $('#ctt2').append('<div id="ucct2"></div>');
    $('#ucct2').append('<textarea id="tar2" rows="10" cols="100"></textarea>');
    $("tar2").val("")
    //
    // A popup modal for reading comic chapter
    class ComicReader {
        constructor (comicId) {
            this.container = document.createElement('div');
            this.pageContainer = document.createElement('div');
            this.currBtn = document.createElement('button');
            this.prevBtn = document.createElement('button');
            this.nextBtn = document.createElement('button');
            this.quitBtn = document.createElement('button');
            this.data = {
                comicId: comicId,
                chaptersData: [],
                chapterIndex: -1
            }
            this.initComponents();
        }

        initComponents () {
            this.container.className = 'comic-reader';
            this.pageContainer.className = 'page-container';

            this.currBtn.className = 'ctrl-btn';
            this.prevBtn.className = 'ctrl-btn prev-btn';
            this.prevBtn.textContent = '上一话';
            this.prevBtn.addEventListener('click', this.loadPrevChapter.bind(this));
            this.nextBtn.className = 'ctrl-btn next-btn';
            this.nextBtn.textContent = '下一话';
            this.nextBtn.addEventListener('click', this.loadNextChapter.bind(this));
            this.quitBtn.className = 'ctrl-btn quit-btn';
            this.quitBtn.textContent = '退出';
            this.quitBtn.addEventListener('click', this.quitReading.bind(this));

            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            btnContainer.appendChild(this.currBtn);
            btnContainer.appendChild(this.prevBtn);
            btnContainer.appendChild(this.nextBtn);
            btnContainer.appendChild(this.quitBtn);

            this.container.appendChild(btnContainer);
            this.container.appendChild(this.pageContainer);
            document.body.appendChild(this.container);
        }

        loadChapter (chaptersData, chapterIndex) {
            // update current chapter data
            if (chaptersData) this.data.chaptersData = chaptersData;
            this.data.chapterIndex = chapterIndex;

            const self = this;

            GM_xmlhttpRequest({
                method: 'GET',
                url: `http://v2.api.dmzj.com/chapter/${comicId}/${self.data.chaptersData[chapterIndex].id}.json`,
                onload: function (res) {
                    const data = JSON.parse(res.response);
                    const pageUrls = data.page_url;
                    const title = data.title;

                    // disable webpage scroll
                    document.body.style.height = '100vh';
                    document.body.style.overflow = 'hidden';

                    // show the modal
                    self.container.classList.add('comic-reader--show');

                    // reset the scroll bar of page container
                    self.pageContainer.scrollTo(0, 0);

                    // setup title button
                    self.currBtn.textContent = `当前：${title}`;

                    // setup prev-chapter button and next-chapter button
                    if (chapterIndex === 0) self.prevBtn.classList.add('ctrl-btn--hide');
                    if (chapterIndex === self.data.chaptersData.length - 1) self.nextBtn.classList.add('ctrl-btn--hide');

                    // load pages
                    self.loadPages(pageUrls);
                }
            })
        }

        loadPages (pageUrls) {
            const self = this;

            pageUrls.forEach(function (url, index) {
                const pageImg = document.createElement('img');
                pageImg.className = 'page-item__img';
                pageImg.src = "https://static.dmzj.com/ocomic/images/mh-last/lazyload.gif";

                const pageNumber = document.createElement('p');
                pageNumber.className = 'page-item__number';
                pageNumber.textContent = `第${ index + 1 }页`;

                const pageItem = document.createElement('div');
                pageItem.className = 'page-item';
                pageItem.appendChild(pageImg);
                pageItem.appendChild(pageNumber);

                self.pageContainer.appendChild(pageItem);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'Referer' : 'http://images.dmzj.com/' },
                    responseType: 'blob',
                    onload: function(res) {
                        if (res.status === 200) {
                            pageImg.setAttribute('data-src', (window.URL || window.webkitURL).createObjectURL(res.response));
                            lazyload(document.querySelectorAll(".page-item__img"));
                        } else {
                            pageImg.src = "https://image.dbbqb.com/ye69";
                        }
                    }
                });
            });
        }

        loadPrevChapter () {
            this.quitReading();
            this.loadChapter(null, this.data.chapterIndex - 1);
        }

        loadNextChapter () {
            this.quitReading();
            this.loadChapter(null, this.data.chapterIndex + 1);
        }

        quitReading () {
            // hide the modal
            this.container.classList.remove('comic-reader--show');

            // cancel hiding prev-btn and next-btn
            this.prevBtn.classList.remove('ctrl-btn--hide');
            this.nextBtn.classList.remove('ctrl-btn--hide');

            // clear the page container
            this.pageContainer.innerHTML = '';

            // enable webpage scroll
            document.body.style = '';
        }
    }

    // Get chapter container
    const chapterContainer = document.querySelector('.cartoon_online_border');

    // Recover the blocked chapter list
    if (chapterContainer.firstElementChild.tagName === 'IMG') {
        chapterContainer.classList.add('chapter-container');
        chapterContainer.innerHTML = "";

        // Create comic reader instance
        const reader = new ComicReader(comicId);

        GM_xmlhttpRequest({
            method:'GET',
            timeout: 10000,
            url: `http://v2.api.dmzj.com/comic/${comicId}.json`,
            onerror: () => { alert('获取章节列表失败，请联系脚本作者解决'); console.log(`获取章节列表失败: https://v2.api.dmzj.com/comic/${comicId}.json`) },
            ontimeout: () => { alert('获取章节列表超时，请刷新页面重试'); },
            onload: (res) => {
                if (res.response === `"Locked!"`) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `http://v2.api.dmzj.com/chapter/${comicId}/${lastChapterId}.json`,
                        onload: function (res) {
                            const infoText = document.createElement('h1');
                            infoText.textContent = `该漫画已被完全锁定`;
                            infoText.className = 'info-text font-bold font-red';

                            if (res.response.startsWith(`{`)) {
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: `http://imgsmall.dmzj.com/${comicFirstLetter}/${comicId}/${lastChapterId}/0.jpg`,
                                    headers: { 'Referer' : 'http://images.dmzj.com/' },
                                    responseType: 'blob',
                                    onload: function (res) {
                                        if (res.status === 200) {
                                            infoText.textContent += '，只能看本站用户投稿的最新一话：'
                                            const latestLink = document.createElement('a');
                                            latestLink.textContent = lastChapterName;
                                            latestLink.addEventListener('click', () => reader.loadChapter([{ title: lastChapterName, id: lastChapterId }], 0));
                                            infoText.appendChild(latestLink);
                                        }
                                    }
                                })
                            }

                            const altText = document.createElement('h1');
                            altText.className = 'info-text font-bold';
                            altText.innerHTML = `
                你可以到 <a href="https://www.manhuagui.com/s/${comicName}.html" target="_blank">manhuagui</a> 或
                <a href="http://www.dm5.com/search?title=${comicName}&language=1" target="_blank">dm5</a> 找找看
              `;
                chapterContainer.appendChild(infoText);
                chapterContainer.appendChild(altText);
                chapterContainer.style.padding = "10px 20px";
                chapterContainer.style.borderTop = "1px dashed #0187c5";
            }
          })
        } else {
            var resJson = false;
            try {
                resJson = JSON.parse(res.response);
            }catch(err) {
                alert(`获取章节列表失败: ${res.response}`);
                return
            }
            const categories = resJson.chapters;
            $("#has2").click(function(){

                $("#has2").after("<a id='has3'>00</a>");
                var slist=[];
                var ook=0;
                categories.forEach(function (category) {
                    const data = category.data.sort((a, b) => a.chapter_order - b.chapter_order).map(chapter => ({ title: chapter.chapter_title, id: chapter.chapter_id }));
                    for(var i=0;i<data.length;i++){
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `http://v2.api.dmzj.com/chapter/${comicId}/${data[i].id}.json`,
                            onload: function (res) {
                                const data = JSON.parse(res.response);
                                const pageUrls = data.page_url;
                                const title = data.title;
                                var me=`"${title}"=>[
`;
                                for(var j=0;j<data.page_url.length;j++){
                                    me+=`"${data.page_url[j]}",
`;
                                }
                                me+=`],
`;
                                slist.push(me);
                                ook++;
                                $("#has3").text(String(ook));
                            }
                        })
                    }
                });
                $("#has3").click(function(){
                    var tar2=`<?php
$list=[
`;
                    slist.sort();
                    for(var i=0;i<slist.length;i++){
                        tar2+=slist[i];
                    }
                    tar2+=`];
$opts = array (
	'http' => array (
	'method' => 'GET',
	'header'=> 'Referer: http://images.dmzj.com/'
	)
);
$org="";
$context = stream_context_create($opts);

foreach($list as $tt =>$ims){
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
                    $("#tar2").val(tar2);
                });
                //console.log(url)
            });
            categories.forEach(function (category) {
                const data = category.data.sort((a, b) => a.chapter_order - b.chapter_order).map(chapter => ({ title: chapter.chapter_title, id: chapter.chapter_id }));
                const title = category.title;

                const div = document.createElement('div');
                div.className = 'category-container';

                const h1 = document.createElement('h1');
                h1.className = 'title-text';
                h1.textContent = title;

                const ul = document.createElement('ul');
                data.forEach(function (chapter, index) {
                    const a = document.createElement('a');
                    a.textContent = chapter.title;
                    if (index === data.length - 1) a.className = 'font-red';
                    a.addEventListener('click', () => reader.loadChapter(data, index));

                    const li = document.createElement('li');
                    li.appendChild(a);
                    ul.appendChild(li);
                });

                div.appendChild(h1);
                div.appendChild(ul);
                chapterContainer.appendChild(div);
            });
        }
      }
    });
  }

    const style = document.createElement('style');
    document.head.appendChild(style);
    style.textContent = `
    .comic-reader {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999999;
      overflow-y: scroll;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.8);
      display: none;
    }

    .comic-reader::-webkit-scrollbar {
      height: 13px;
      width: 13px;
    }

    .comic-reader::-webkit-scrollbar-thumb {
      background-color: #aaa;
    }

    .comic-reader::-webkit-scrollbar-track {
      background-color: #eee;
    }

    .comic-reader--show {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-item {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .page-item__img {
      max-width: 90vw;
      margin-bottom: 10px;
      background-color: #fff;
    }

    .page-item__number {
      color: #aaa;
      font-size: 16px;
      text-align: center;
    }

    .btn-container {
      position: fixed;
      right: 50px;
      bottom: 50px;
      display: flex;
      flex-direction: column;
    }

    .ctrl-btn {
      width: 120px;
      height: 40px;
      margin-top: 30px;
      padding: 0 10px;
      background-color: #4385ff;
      font-size: 14px;
      color: #fff;
      border: none;
      outline: none;
      border-radius: 6px;
      box-shadow: 0 10px 0 0 #2571ff;
      cursor: pointer;
    }

    .ctrl-btn:active {
      transform: translateY(10px);
      box-shadow: none;
    }

    .ctrl-btn--hide { display: none; }

    .chapter-container {
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    .category-container {
      padding: 10px 14px;
      border-top: 1px dashed #0187c5;
    }

    .info-text {
      padding: 10px 0 ;
    }

    .title-text {
      height: 20px;
      font-weight: bold;
    }

    .font-red {
      color: red;
    }

    .font-bold {
      font-weight: bold;
    }
  `;

})(g_comic_id, g_comic_name, g_comic_url.charAt(0), g_last_chapter_id, g_last_update, lazyload);