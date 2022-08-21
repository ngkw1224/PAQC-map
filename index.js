// Initialize and add the map
function initMap() {
  // The location of hongkong
  const hongkong = { lat: 22.3193, lng: 114.1694 };
  // The map, centered at hongkong
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: hongkong,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: hongkong,
    map: map,
  });
}

window.initMap = initMap;
