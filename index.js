// Initialize and add the map
function initMap() {
  // The location of hongkong
  const hongkong = { lat: 22.3193, lng: 114.1694 };
  // The map, centered at hongkong
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 22,
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
      icon: iconBase + "veryhigh.png",
    },
  };

  // The marker, positioned at Hong Kong
  const marker = new google.maps.Marker({
    position: hongkong,
    map: map,
    type: "low",
  });
}

window.initMap = initMap;
