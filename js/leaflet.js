d3.json('../json/business.json', function(error, d){
    if (error) {  //If error is not null, something went wrong.
        console.log(error);  //Log the error.
    } else {      //If no error, the file loaded correctly. Yay!
        // console.log('Total # Business in Neighborhood: ' + d.hits.total);
        console.log(d.lat,d.long)
        var mymap = L.map('mapid').setView([ d.lat, d.long ], 10); 
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVraGF5ZyIsImEiOiJjazk2cDhkem4weTd4M2luMWxvaGJ0Y3hhIn0.5J3UDWncn8GVw5UHUIMSDA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicmVraGF5ZyIsImEiOiJjazk2cDhkem4weTd4M2luMWxvaGJ0Y3hhIn0.5J3UDWncn8GVw5UHUIMSDA'
    }).addTo(mymap);
    var marker = L.marker([ d.lat, d.long]).addTo(mymap);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

    }
})