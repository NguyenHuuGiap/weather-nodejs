$(function() {
  $("form").on("submit", function(event) {
    var location_name = $.trim($("input[name='zip']").val());
    event.preventDefault();
    geoCoderGG(location_name)
  });
});

function geoCoderGG(location_name) {
  var geocoder =  new google.maps.Geocoder();
  geocoder.geocode( { 'address': location_name}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      sendData(lat, lng);
    }
    else {
      alert("Something got wrong " + status);
    }
  });
}

function sendData(lat, lng) {
  var $zip = $("input[name='zip']");
  var $h1 = $("h1");
  $h1.text("Loading...");
  $.ajax({
    url: "/" + 12345,
    data: {lat: lat, lng: lng},
    dataType: "json",
    success: function(data) {
      var temperature = data.temperature;
      $h1.html("It is " + temperature + "&#176; in " + $.trim($zip.val()) + "." + " Summary daily: " + data.summaryDaily);
    },
    error: function(err) {
      $h1.text("Error!");
    }
  });
}
