// Firebase preparations
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyCKxicAyIUzf3Sk9ByUUiMlpZRN1pOgQZk",
  authDomain: "jsse-paqc2.firebaseapp.com",
  databaseURL: "https://jsse-paqc2-default-rtdb.firebaseio.com",
  projectId: "jsse-paqc2",
  storageBucket: "jsse-paqc2.appspot.com",
  messagingSenderId: "360158252466",
  appId: "1:360158252466:web:9668099c35254b769e28ab"
};
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, set, child, update, remove, get, onValue}
from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const db = getDatabase();

// HK Central Lib. latitude and longitude
const init_pos = { lat: 22.28017342385383, lng: 114.18976248650614 };

// AQHI icons
const iconBase = "./";
const icons = {
  low: {icon: iconBase + "low.png",},
  moderate: {icon: iconBase + "moderate.png",},
  high: {icon: iconBase + "high.png",},
  veryhigh: {icon: iconBase + "veryhigh.png",},
  serious: {icon: iconBase + "serious.png",},
};

var markers_dict = {}; // To avoid duplicate keys
var markers = []; // Dictionary as list for looping
var google_markers = []; // List of google.maps.Marker objects
var map; // Initialize map object as global variable
var info_windows = []; // List to store all info windows
var today = new Date();
var worksheet = Array(607);

// Grabber for EPD's .csv on AQHI of HK 18 districts
// Parser for the .csv and function to push the data to firebase
function parse_EPD_data() {
  today = new Date();
  var m = today.getMonth();
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = today.getFullYear();
  var d = today.getDate();
  var hour = today.getHours();

  // Fix for the ugly "midnight = 24:00" convention of EPD :o)
  if (hour == 0) {
    hour = 24;
    today = date.getDate() - 1;
    var m = today.getMonth();
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    d = today.getDate();
  };

  var central_western = {}; var southern = {}; var eastern = {}; var kwuntong = {}; var ssp = {}; var kwaichung = {}; var tsuenwan = {};
  var tseungkwano = {}; var yuenlong = {}; var tuenmun = {}; var tungchung = {}; var taipo = {}; var shatin = {}; var northern = {};
  var tapmun = {}; var cwb = {}; var central = {}; var mk = {};

  central_western["lat"] = 22.285228519802224; central_western["lng"] = 114.1444015394532;
  central["lat"] = 22.28205225028763; central["lng"] = 114.1583231161608;
  mk["lat"] = 22.322749932664152; mk["lng"] = 114.16833837013698;
  ssp["lat"] = 22.330315303746556; ssp["lng"] = 114.15944459102168;
  kwaichung["lat"] = 22.357262742976005; kwaichung["lng"] = 114.12970055664383;
  tsuenwan["lat"] = 22.374244990241383; tsuenwan["lng"] = 114.11758700042473;
  shatin["lat"] = 22.37932452091829; shatin["lng"] = 114.1836766294444;
  kwuntong["lat"] = 22.311052846159576; kwuntong["lng"] = 114.23139849216133;
  tseungkwano["lat"] = 22.319628333707602; tseungkwano["lng"] = 114.26058092439786;
  taipo["lat"] = 22.45470198491806; taipo["lng"] = 114.1668538188997;
  yuenlong["lat"] = 22.448019872006654; yuenlong["lng"] = 114.02246425324113;
  tuenmun["lat"] = 22.393908324963913; tuenmun["lng"] = 113.97783229805586;
  tungchung["lat"] = 22.29223502998915; tungchung["lng"] = 113.9448970316842;
  tapmun["lat"] = 22.48218287931825; tapmun["lng"] = 114.36460661703158;
  eastern["lat"] = 22.29425580217993; eastern["lng"] = 114.22796416961822;
  cwb["lat"] = 22.28917317213262; cwb["lng"] = 114.18195892350418;
  southern["lat"] = 22.247618747093338; southern["lng"] = 114.1599702259586;
  northern["lat"] = 22.496910233751937; northern["lng"] = 114.12847524130514;

  var row_number = 6 + (d - 1)*25 + (hour - 1);
  console.log(row_number);

  const csvData = Papa.parse("https://www.aqhi.gov.hk/epd/ddata/html/history/" + yyyy + "/" + yyyy + mm + "_ChT.csv", {
    header: false,
    download: true,
    complete: function(data) {
      worksheet = data.data;
      console.log("downloaded csv");
      console.log(worksheet);
    }
  });

  function getAQHI () {
    console.log(worksheet[row_number])
    central_western["AQHI"] = parseFloat(worksheet[row_number][2]);
    southern["AQHI"] = parseFloat(worksheet[row_number][3]);
    eastern["AQHI"] = parseFloat(worksheet[row_number][4]);
    kwuntong["AQHI"] = parseFloat(worksheet[row_number][5]);
    ssp["AQHI"] = parseFloat(worksheet[row_number][6]);
    kwaichung["AQHI"] = parseFloat(worksheet[row_number][7]);
    tsuenwan["AQHI"] = parseFloat(worksheet[row_number][8]);
    tseungkwano["AQHI"] = parseFloat(worksheet[row_number][9]);
    yuenlong["AQHI"] = parseFloat(worksheet[row_number][10]);
    tuenmun["AQHI"] = parseFloat(worksheet[row_number][11]);
    tungchung["AQHI"] = parseFloat(worksheet[row_number][12]);
    taipo["AQHI"] = parseFloat(worksheet[row_number][13]);
    shatin["AQHI"] = parseFloat(worksheet[row_number][14]);
    northern["AQHI"] = parseFloat(worksheet[row_number][15]);
    tapmun["AQHI"] = parseFloat(worksheet[row_number][16]);
    cwb["AQHI"] = parseFloat(worksheet[row_number][17]);
    central["AQHI"] = parseFloat(worksheet[row_number][18]);
    mk["AQHI"] = parseFloat(worksheet[row_number][19]);

    set(ref(db, "jssemodel_copy2"),{
      central_western: central_western,
      southern: southern,
      eastern: eastern,
      kwuntong: kwuntong,
      ssp: ssp,
      kwaichung: kwaichung,
      tsuenwan: tsuenwan,
      tseungkwano: tseungkwano,
      yuenlong: yuenlong,
      tuenmun: tuenmun,
      tungchung: tungchung,
      taipo: taipo,
      shatin: shatin,
      northern: northern,
      tapmun: tapmun,
      cwb: cwb,
      central: central,
      mk: mk
    });
  }
  setTimeout(getAQHI, 3000);

  console.log("data pushed to firebasedb from EPD!")
}

// Assume EPD data updates exactly every 3600 s
setInterval(parse_EPD_data, 5000);

// For completeness
function GetAllDataOnce(){
  const dbref = ref(db);

  get(child(dbref, "jssemodel_copy2")).then((snapshot)=>{
    snapshot.forEach(childSnapshot => {
      let keyName = childSnapshot.key;
      let data = childSnapshot.val();
      markers_dict[keyName] = data;
    });
    console.log(markers_dict);
  })
}

// Getting data real time
function GetAllDataRealtime(){
  const dbref = ref(db, "jssemodel_copy2");
  onValue(dbref, (snapshot) => {
    snapshot.forEach(childSnapshot => {
      let keyName = childSnapshot.key;
      let data = childSnapshot.val();
      markers_dict[keyName] = data;
    });
    // console.log(markers_dict);
    if (google_markers != null) {
      SetMarker(map, markers);
    }
  })
}

// Function to anchor markers on Google Maps
function SetMarker(map, markers) {
  // Remove previous Markers.
  if (google_markers != null) {
    for (let i = 0; i < google_markers.length; i++) {
      google_markers[i].setMap(null);
    }
    google_markers = [];
  }

  // Convert dictionary to list
  markers = Object.entries(markers_dict);
  markers_dict = {};

  for (let i = 0; i < markers.length; i++) {
    var marker_data = markers[i][1];
    // console.log(marker_data);

    // Set icon according to AQHI
    var AQHI = parseFloat(marker_data["AQHI"]);
    // console.log(marker_data["AQHI"]);
    var marker_icon_label;
    if (AQHI <= 3) {
      marker_icon_label = "low";
    } else if (AQHI <= 6) {
      marker_icon_label = "moderate";
    } else if (AQHI <= 7){
      marker_icon_label = "high";
    } else if (AQHI <= 10){
      marker_icon_label = "veryhigh";
    } else {
      marker_icon_label = "serious";
    }

    // Set info using pollutant concentrations
    var NO2 = parseFloat(marker_data["NO2"]);
    var SO2 = parseFloat(marker_data["SO2"]);
    var O3 = parseFloat(marker_data["O3"]);
    var PM25 = parseFloat(marker_data["PM25"]);
    var PM10 = parseFloat(marker_data["PM10"]);
    if (isNaN(NO2)) { NO2 = "Not available"};
    if (isNaN(SO2)) { SO2 = "Not available"};
    if (isNaN(O3)) { O3 = "Not available"};
    if (isNaN(PM25)) { PM25 = "Not available"};
    if (isNaN(PM10)) { PM10 = "Not available"};

    // Info to show pollutant concentrations and AQHI numerical value upon clicking marker
    var info_string =  '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    "<p><b>AQHI: </b>" + AQHI + "<br>" +
    "<b>O3 conc.: </b>" + O3 + "<br>" +
    "<b>NO2 conc.: </b>" + NO2 + "<br>" +
    "<b>SO2 conc.: </b>" + SO2 + "<br>" +
    "<b>PM2.5 conc.: </b>" + PM25 + "<br>" +
    "<b>PM10 conc.: </b>" + PM10 + "</p>" + "</div>" + "</div>";

    // Set Markers on Map
    var marker = new google.maps.Marker({
        position: { lat: parseFloat(marker_data["lat"]), lng: parseFloat(marker_data["lng"]) },
        icon: icons[marker_icon_label].icon,
    });
    var infowindow = new google.maps.InfoWindow({
      content: info_string,
    });
    info_windows.push(infowindow);
  
    marker.setMap(map);
    google_markers.push(marker);

    marker.addListener("click", () => {
      info_windows[i].open({
        anchor: google_markers[i],
        map,
        shouldFocus: true,
      });
    });

    // console.log("marker added!");
    // console.log(marker);
  };
};

function initMap() {
  var mapOptions = {
      center: init_pos,
      zoom: 18,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  SetMarker(map, markers);
};
window.initMap = initMap;
window.onload = function () {
  parse_EPD_data()
  GetAllDataRealtime();
  initMap();
}