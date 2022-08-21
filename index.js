// Initialize and add the map
function initMap() {
  // The location of hongkong
  const hongkong = { lat: 22.3193, lng: 114.1694 };
  // The map, centered at hongkong
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: hongkong,
  });
  
  const iconBase =
    "./";
  const icons = {
    low: {
      icon: iconBase + "low.png",
    },
    moderate: {
      icon: iconBase + "moderate.png",
    },
    high: {
      icon: iconBase + "high.png",
    },
    veryhigh: {
      icon: iconBase + "veryhigh.png",
    },
    serious: {
      icon: iconBase + "serious.png",
    },
  };

  // The marker, positioned at Hong Kong
  const marker = new google.maps.Marker({
    position: hongkong,
    map: map,
    type: "serious",
  });
}

window.initMap = initMap;

var firebase = new Firebase("https://jsse-paqc-aa144.firebaseio.com/");

var ref = firebase.database().ref("firebasetest");

ref.on("value", function(snapshot) {
snapshot.forEach(function(childSnapshot) {
 var childData = childSnapshot.val();
 var level1faggot = childData.level1faggot;
 var level2faggot = childData.level2faggot;
 var level3faggot = childData.level3faggot;
});
});
