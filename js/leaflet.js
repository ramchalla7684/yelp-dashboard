function showOnMap(businesses) {
    if (!map) {
        map = L.map('mapid').setView([businesses[0].latitude, businesses[0].longitude], 12);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVraGF5ZyIsImEiOiJjazk2cDhkem4weTd4M2luMWxvaGJ0Y3hhIn0.5J3UDWncn8GVw5UHUIMSDA', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicmVraGF5ZyIsImEiOiJjazk2cDhkem4weTd4M2luMWxvaGJ0Y3hhIn0.5J3UDWncn8GVw5UHUIMSDA'
        }).addTo(map);
    }

    for (let marker of markers) {
        marker.remove();
    }

    markers = [];
    for (let business of businesses) {
        let marker = new L.marker([business.latitude, business.longitude])
            .bindPopup(`
                <h3>${business.name}</h3>
                <h4>${business.address}</h4>`)
            .addTo(map)
            .on('mouseover', function (event) {
                this.openPopup();
            })
            .on('mouseout', function (event) {
                this.closePopup();
            })
            .on('click', function (event) {
                let selectedMarkerIcon = document.querySelector('img.__selected');
                if (selectedMarkerIcon) {
                    selectedMarkerIcon.classList.remove('__selected');
                    selectedMarkerIcon.classList.add('__unselected');
                }
                marker._icon.classList.remove('__unselected');
                marker._icon.classList.add('__selected');
                loadBusinessDetails(business.business_id);
            });
        marker._icon.classList.add('__unselected');
        markers.push(marker);
    }
    map.flyTo(new L.LatLng(businesses[0].latitude, businesses[0].longitude));
    markers[0]._icon.click();
}