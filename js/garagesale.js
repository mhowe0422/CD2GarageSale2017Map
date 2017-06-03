//src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCb3EA0lfao273s6Jkp8tfTzJfUSkswpOw&libraries=visualization";
src = "jquery-1.11.2.js";
src = "bootstrap.js";
//src = "citymapoverlays.js";



var markers = [];
var getSelectValues = function (select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
};



var bindEvent = function (element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        element.attachEvent('on' + type, handler);
    }
};

function initialize() {
    var infoWindow = new google.maps.InfoWindow;

    map = new google.maps.Map(document.getElementById("mapsection"), {
        center: new google.maps.LatLng(40.4454480, -80.0388750),
        zoom: 12,
        mapTypeId: 'roadmap'
    });
    var zoomlevel = map.getZoom();
    console.log('Zoom: ' + zoomlevel);

    var featureStyle = {
        fillColor: '#fff',
        strokeWeight: 1,
        clickable: 'true'

    };
    map.addListener('zoom_changed', function () {
        var zoomlevel = map.getZoom();
        console.log('Zoom: ' + zoomlevel);

    });

    lgj = new google.maps.Data();

    lgj.loadGeoJson("./resources/Neighborhood.json");
    lgj.setStyle(featureStyle);



    lgj.addListener('mouseover', function (event) {
        lgj.revertStyle();
        lgj.overrideStyle(event.feature, {strokeWeight: 4});

        var name = event.feature.getProperty("HOOD");
        var contentlabel = name;
        console.log("Name " + name);
        document.getElementById('info-box').textContent = contentlabel;
    });
    
    lgj.addListener('mouseout', function (event) {
        lgj.revertStyle();
    });

//    lgj.addListener('zoom_changed', function () {
//        console.log('Zoom: ' + getZoom());
//    });

    lgj.setMap(map);

    downloadUrl("./garagesaleaddresses.xml", function (data) {
        var xml = data.responseXML;
        var markers = xml.documentElement.getElementsByTagName("marker");
        //alert(markers.length);            
        for (var i = 0; i < markers.length; i++) {

            var address = markers[i].getAttribute("STREET_NAME");

            var point = new google.maps.LatLng(
                    parseFloat(markers[i].getAttribute("lat")),
                    parseFloat(markers[i].getAttribute("lng")));
            var html = "<b>" + address + "</b> <br/>";
            var icon = './img/roundbg_check_black.png';

            var marker = new google.maps.Marker({
                map: map,
                position: point,
                icon: icon
            });
            //marker.addListener('click', bindInfoWindow(marker, map, infoWindow, html));
            bindInfoWindow(marker, map, infoWindow, html);
        }
    });


    //getBikeLocations(state.map, infoWindow);
}

function bindInfoWindow(marker, map, infoWindow, html) {

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });

}

function downloadUrl(url, callback) {
    console.log(url);
    var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };

    request.open('GET', url, true);
    //request.setRequestHeader();
    request.send(null);
}

function doNothing() {
}

function setMarkers(map) {
    var marker = new google.maps.Marker({
        map: map
    });
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function showMarkers(map) {
    setMapOnAll(map);
}
function clearMarkers() {
    setMapOnAll(null);
}

google.maps.event.addDomListener(window, 'load', initialize);

