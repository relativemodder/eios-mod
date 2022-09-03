// ==UserScript==
// @name New Script
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
  urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
        	
          return '<a href="' + url + '">' + url + '</a>';
      })
      // or alternatively
      // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }
  
  customise(){
    console.log("Beginning...");
    setTimeout(() => this.customiseHeader(), 200);
    setTimeout(() => this.customiseAccountManage(), 200);
    setTimeout(() => this.urlifyContainers(), 200);
    setTimeout(() => this.addDinoGame(), 200);
    setTimeout(() => this.addCustomTimetable(), 200);
    setTimeout(() => this.customiseLeftSide(), 200);
    setTimeout(() => this.customiseModal(), 200);
  }
  
  tryGetOption(k){
    let defaults = {
      "dino": false,
      "hiddenlis": "[]"
    };
    
    return localStorage[k] != undefined ? localStorage[k] : defaults[k]
  }
  
  openModal(){
    $('.modalwindow').show("fast");
  }
  saveAndCloseModal(){
    
    // Сериализуем настройки
    // Настройки разделов
    
    let hids = [];
    
    $("input", $(".hiddens")).each(function(i, element, val){
        element = $(element);
      	let checked = element.is(':checked');
      	if (checked)
      		hids.push(String(i));
    });
    
    hids = JSON.stringify(hids);
    
    localStorage.setItem("hiddenlis", hids);
    
    $('.modalwindow').hide("fast");
    setTimeout(() => {
      location=location
    }, 300);
  }
  
  customiseModal(){
    let modalHtml = `
    <div class="modalwindow">
    	<center><h1>Настройки мода для ЭИОС</h1> <a onclick="eios.saveAndCloseModal()" style="cursor: pointer;">Закрыть, сохранить и перезагрузить</a></center>
        <li role="separator" class="divider">Невидимость элементов из левого списка (beta)</li>
        <ul class="nav navmenu-nav hiddens">
        	<li><a><input type="checkbox" value="off"> Сообщения</a></li>
        	<li><a><input type="checkbox"> События</a></li>
        	<li><a><input type="checkbox"> Новости и обновления</a></li>
        	<li><a><input type="checkbox"> Портфолио</a></li>
        	<li><a><input type="checkbox"> Моя индивидуальная траектория</a></li>
        	<li><a><input type="checkbox"> Рабочие программы</a></li>
        	<li><a><input type="checkbox"> Успеваемость</a></li>
        	<li><a><input type="checkbox"> Расписание</a></li>
        	<li><a><input type="checkbox"> Общение</a></li>
        	<li><a><input type="checkbox"> Трудоустройство</a></li>
        	<li><a><input type="checkbox"> Документы</a></li>
        	<li><a><input type="checkbox"> Социальная поддержка</a></li>
        	<li><a><input type="checkbox"> Тесты</a></li>
        	<li><a><input type="checkbox"> Онлайн-встречи</a></li>
        	<li><a><input type="checkbox"> Опросы</a></li>
        	<li><a><input type="checkbox"> Мои документы</a></li>
        	<li><a><input type="checkbox"> Удалённая работа</a></li>
        	<li><a><input type="checkbox"> Справки / заявки</a></li>
        	<li><a><input type="checkbox"> Подача документов</a></li>
        	<li><a><input type="checkbox"> Задолженности</a></li>
        	<li><a><input type="checkbox"> Руководство пользователя ЭИОС</a></li>
        	<li><a><input type="checkbox"> Оплата</a></li>
        	<li><a><input type="checkbox"> Ссылки на внешние ресурсы</a></li>
        </ul>
    </div>
    `;
    $('body').append(modalHtml);
    
    let hiddenlis = JSON.parse(this.tryGetOption("hiddenlis"));
    console.log(hiddenlis);
    hiddenlis.forEach((elem, i, arr) => {
      $($("input", $(".hiddens"))[Number(elem)]).prop('checked', true);
    });
  }
  customiseLeftSide(){
    $('.navmenu-nav').append(`<li role="separator" class="divider"></li>`);
    $('.navmenu-nav').append(`<li><a href="javascript:void(0)" onclick="eios.openModal()">Настройки модификации</a></li>`);
    
    let hiddenlis = JSON.parse(this.tryGetOption("hiddenlis"));
    console.log(hiddenlis);
    hiddenlis.forEach((elem, i, arr) => {
      $($("nav").children().find('a').not('divider')[Number(elem)]).hide();
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
  urlifyContainers(){
    $('.panel-body').html(this.urlify($('.panel-body').html() !== null ? $('.panel-body').html() : ""));
  }
  
  addCustomTimetable(){
    if(location.toString().includes("/Learning/TimeTable/TimeTable")){
      
      $('#MainContent_hrefExport').prop('outerHTML', (`<br>${$('#MainContent_hrefExport').prop('outerHTML')}`));
      
      	let htmlcode = `
        <br><br>
        <div class="customTimetable">
          <table class="table table-bordered table-striped tt-table">
                    <thead>
                        <tr>
                            <th colspan="4" class="tt-h1 info">Кастомное расписание <mark>provided by EIOS mod</mark></th>
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
          
      let timetableURL = `https://raw.githubusercontent.com/relativemodder/eios-114b-grp-timetable/main/timetable.json?${ms}`;
      let tick = $("a", $(".active", $(".pagination")[0]))[0]["href"].split("?tick=")[1];
      
      
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
