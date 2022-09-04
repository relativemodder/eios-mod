// ==UserScript==
// @name EIOS mod
// @namespace OrangeMonkey Scripts
// @grant none
// ==/UserScript==

console.log(`Eios customiser. Current location = ${location}`);
console.log(`Is MRSU Eios site = ${location.toString().includes("p.mrsu.ru")}`);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // если присутствует, заголовок - это место, откуда вы перемещаете DIV:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // в противном случае переместите DIV из любого места внутри DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // получить положение курсора мыши при запуске:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // вызов функции при каждом перемещении курсора:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // вычислить новую позицию курсора:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // установите новое положение элемента:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // остановка перемещения при отпускании кнопки мыши:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function loadJSON(filePath) {
  // Load json file;
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}   

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
    // TODO Throw exception
    return null;
  }
}
class EiosCustomiser{
  
  isMobile() {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true; 
      }
      return false;
  }
  
  urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
        	
          return '<a href="' + url + '">' + url + '</a>';
      })
      // or alternatively
      // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }
  
  customiseHead(){
    let dt = new Date();
    let ms = dt.getMilliseconds();
    let stylish = loadTextFileAjaxSync(`https://raw.githubusercontent.com/relativemodder/eios-mod/main/style.css?cache=${ms}`, "text/plain");
    let mobilestyle = loadTextFileAjaxSync(`https://raw.githubusercontent.com/relativemodder/eios-mod/main/mobile-style.css?cache=${ms}`, "text/plain");
    $('body').append(`<style>
    ${stylish}
    </style>`);
    
    if(this.isMobile()){
      $('body').append(`<style>
        ${mobilestyle}
        </style>`);
    }
  }
  
  customise(){
    console.log("Beginning...");
    setTimeout(() => this.customiseHead(), 20);
    setTimeout(() => this.customiseHeader(), 200);
    setTimeout(() => this.customiseAccountManage(), 200);
    setTimeout(() => this.urlifyContainers(), 200);
    setTimeout(() => this.addDinoGame(), 200);
    setTimeout(() => this.addCustomTimetable(), 200);
    setTimeout(() => this.customiseLeftSide(), 200);
    setTimeout(() => this.customiseModal(), 200);
    setTimeout(() => this.customiseEventsPage(), 200);
    setTimeout(() => this.initSwitches(), 200);
  }
  
  initSwitches(){
    $('.switch-btn').click(function(){
      $(this).toggleClass('switch-on');
    });
  }
  
  tryGetOption(k){
    let defaults = {
      "dino": false,
      "hiddenlis": "[]",
      "timetableURL": "yet",
      "customTT": 'false'
    };
    
    return localStorage[k] != undefined ? localStorage[k] : defaults[k]
  }
  
  openModal(){
    $('.modalwindow').show("fast");
  }
  openModalAndScroll(selector){
    this.openModal();
    $('.modalwindow').animate({
     scrollTop: $(`${selector}`).offset().top // класс объекта к которому приезжаем
     }, 1000);
  }
  saveAndCloseModal(){
    
    // Сериализуем настройки
    // Настройки разделов
    
    let hids = [];
    
    $(".switch-btn", $(".hiddens")).each(function(i, element, val){
        element = $(element);
      	let checked = element.hasClass("switch-on");
      	if (checked)
      		hids.push(String(i));
    });
    
    hids = JSON.stringify(hids);
    localStorage.setItem("hiddenlis", hids);
    
    let customTTURL = $('#customTimetableURLField').val() != "" ? $('#customTimetableURLField').val() : "yet";
    localStorage.setItem("timetableURL", customTTURL);
    
    let enableCustomTT = $('#enableCustomTT').hasClass("switch-on");
    localStorage.setItem("customTT", enableCustomTT);
    
    $('.modalwindow').hide("fast");
    setTimeout(() => {
      location=location
    }, 300);
  }
  
  customiseModal(){
    let modalHtml = `
    <div class="modalwindow">
    	<center><h1>Настройки мода для ЭИОС</h1> <a onclick="eios.saveAndCloseModal()" style="cursor: pointer;">Закрыть, сохранить и перезагрузить</a></center>
        <br><br>
        <li role="separator" class="divider">Невидимость элементов из левого списка (beta)</li>
        <ul class="nav navmenu-nav hiddens">
        	<li><a><div class="switch-btn"></div> Сообщения</a></li>
        	<li><a><div class="switch-btn"></div> События</a></li>
        	<li><a><div class="switch-btn"></div> Новости и обновления</a></li>
        	<li><a><div class="switch-btn"></div> Портфолио</a></li>
        	<li><a><div class="switch-btn"></div> Моя индивидуальная траектория</a></li>
        	<li><a><div class="switch-btn"></div> Рабочие программы</a></li>
        	<li><a><div class="switch-btn"></div> Успеваемость</a></li>
        	<li><a><div class="switch-btn"></div> Расписание</a></li>
        	<li><a><div class="switch-btn"></div> Общение</a></li>
        	<li><a><div class="switch-btn"></div> Трудоустройство</a></li>
        	<li><a><div class="switch-btn"></div> Документы</a></li>
        	<li><a><div class="switch-btn"></div> Социальная поддержка</a></li>
        	<li><a><div class="switch-btn"></div> Тесты</a></li>
        	<li><a><div class="switch-btn"></div> Онлайн-встречи</a></li>
        	<li><a><div class="switch-btn"></div> Опросы</a></li>
        	<li><a><div class="switch-btn"></div> Мои документы</a></li>
        	<li><a><div class="switch-btn"></div> Удалённая работа</a></li>
        	<li><a><div class="switch-btn"></div> Справки / заявки</a></li>
        	<li><a><div class="switch-btn"></div> Подача документов</a></li>
        	<li><a><div class="switch-btn"></div> Задолженности</a></li>
        	<li><a><div class="switch-btn"></div> Руководство пользователя ЭИОС</a></li>
        	<li><a><div class="switch-btn"></div> Оплата</a></li>
        	<li><a><div class="switch-btn"></div> Ссылки на внешние ресурсы</a></li>
        </ul>
        <li role="separator" class="divider">Задать URL для JSON-файла с расписанием</li>
        <br>
        <ul class="nav navmenu-nav" id="setCustomTimetableURL">
        	<li><a><div class="switch-btn" id="enableCustomTT"></div> Включить кастомное расписание</a></li>
        	<li><a>URL JSON расписания: <input type="text" class="btn btn-default" placeholder="URL..." id="customTimetableURLField" style="width: 50%;"></a></li>
        </ul>
    </div>
    `;
    $('body').append(modalHtml);
    
    let hiddenlis = JSON.parse(this.tryGetOption("hiddenlis"));
    console.log(hiddenlis);
    hiddenlis.forEach((elem, i, arr) => {
      $($(".switch-btn", $(".hiddens"))[Number(elem)]).addClass("switch-on");
    });
    
    
    $('#customTimetableURLField').val(this.tryGetOption("timetableURL") == "yet" ? null : this.tryGetOption("timetableURL"));
    
    if(this.tryGetOption("customTT") != 'false')
      $('#enableCustomTT').addClass("switch-on");
  }
  customiseLeftSide(){
    
    let navbarclass = '.navmenu-nav';
    if (this.isMobile())
      navbarclass = '.navbar-nav';
    
    $(navbarclass).append(`<li role="separator" class="divider"></li>`);
    $(navbarclass).append(`<li><a href="javascript:void(0)" onclick="eios.openModal()">Настройки модификации</a></li>`);
    
    let hiddenlis = JSON.parse(this.tryGetOption("hiddenlis"));
    console.log(hiddenlis);
    hiddenlis.forEach((elem, i, arr) => {
      $($(this.isMobile() ? ".navbar-nav" : "nav").children().find('a').not('divider')[Number(elem)]).hide();
      $($("input").children().find('hiddens')[Number(elem)]).prop('checked', true);
    });
  }
  customiseHeader(){
    $('.navbar-t').html("ЭИОС <span class=\"modhint\">(модификация)</span>");
  }
  customiseAccountManage(){
    if(location.toString().includes("/Account/Manage")){
      $('.text-danger').append("&nbsp;&nbsp;&nbsp;&nbsp;");
      $('#passwordForm').append("<br><br>");
      $('#skypeForm').hide();
      $('#externalLoginsForm').hide();
    }
  }
  customiseEventsPage(){
    if(location.toString().includes("/Events/Events")){
      $('#MainContent_Button_MyEventsCab').prop('outerHTML', $('#MainContent_Button_MyEventsCab').prop('outerHTML') + "<br><br>");
    }
  }
  urlifyContainers(){
    $('.panel-body').html(this.urlify($('.panel-body').html() !== null ? $('.panel-body').html() : ""));
  }
  
  addCustomTimetable(){
    if(location.toString().includes("/Learning/TimeTable/TimeTable")){
      
      if(this.tryGetOption("customTT") == 'false')
        return;
      
      $('#MainContent_hrefExport').prop('outerHTML', (`<br>${$('#MainContent_hrefExport').prop('outerHTML')}`));
      
      	let htmlcode = `
        <br><br>
        <div class="customTimetable">
          <table class="table table-bordered table-striped tt-table">
                    <thead>
                        <tr>
                            <th colspan="4" class="tt-h1 info">Кастомное расписание <mark>(mod)</mark></th>
                        </tr>
                        <tr>
                            <th class="tt-h2"><span>Пара</span></th>
                            <th class="tt-h2"><span>Название</span></th>
                            <th class="tt-h2"><span>Время занятия</span></th>
                            <th class="tt-h2"><span>Кто проводит</span></th>
                        </tr>
                    </thead>
                    <tbody id="custom-tt-body">
                    </tbody>
                </table>
      </div>
        `;
      if(!location.toString().includes("?view=week"))
    	$('form').append(htmlcode);
      let dt = new Date();
      let ms = dt.getMilliseconds();
          
      //let timetableURL = `https://raw.githubusercontent.com/relativemodder/eios-114b-grp-timetable/main/timetable.json?${ms}`;
      let timetableURL = this.tryGetOption("timetableURL");
      let tick = $("a", $(".active", $(".pagination")[0]))[0]["href"].split("?tick=")[1];
      
      if (timetableURL == "yet"){
        let information = `
        	<td style="width: 100%; height: 100%;" colspan="4">
            	<center>URL вашего JSON-файла с расписанием не задан.<br>
                Спросите URL у Вашего куратора или сисадмина, зайдите в настройки и задайте URL.<br><br>
                <a href="javascript:void(0)" class="btn" onclick="eios.openModalAndScroll('#setCustomTimetableURL')">Перейти</a></center>
            </td>
        `;
      	$("#custom-tt-body").append(information);
        return;
      }
      let allTimetable = loadJSON(timetableURL);
      console.log(allTimetable);
      let timetable = allTimetable[tick];
      
      timetable.forEach((elem, i, arr) => {
        console.log(elem);
        let row = `
                          <tr>
                              <td>${i+1}.</td>
                              <td>${elem.name}</td>
                              <td>${elem.time}</td>
                              <td>${elem.teacher}</td>
                          </tr>`;
        $("#custom-tt-body").append(row);
      
      });
      
    }
  }
  
  addDinoGame(){
    
    
    let htmlcode = `
    <div id="mydiv">
      <!-- Включите заголовок DIV с тем же именем, что и перетаскиваемый DIV, а затем "header" -->
      <div id="mydivheader">Dino game  <a class="expand"><b>-</b></a></div>
      <iframe src="https://8nykp.csb.app/" class="dinogame"></iframe>
    </div>`;
    
    if(this.tryGetOption("dino") == 'true'){
      	console.log("Adding Dino");
    	$('body').append(htmlcode);
    }
    
    $('.expand').click(function(){
      $('.dinogame').toggle("slow");
    });
    
    
    
    dragElement(document.getElementById("mydiv"));
  }
}

jQuery(document).ready(function() {
  if(location.toString().includes("p.mrsu.ru")){
    eios = new EiosCustomiser();
    eios.customise();
  }
});
