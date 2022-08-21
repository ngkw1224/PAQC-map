// Initialize and add the map
function initMap() {
  // The location of HK
  const HK = { lat: 22.3193, lng: -114.1694 };
  // The map, centered at HK
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: HK,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: HK,
    map: map,
  });
}

window.initMap = initMap;
