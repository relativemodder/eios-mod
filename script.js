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
    	$('form').append(htmlcode);
      let dt = new Date();
      let ms = dt.getMilliseconds();
          
      let timetableURL = `https://raw.githubusercontent.com/relativemodder/eios-114b-grp-timetable/main/timetable.json?${ms}`;
      let tick = document.location.search.split("=")[1];
      
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
    
    $('body').append(htmlcode);
    
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
