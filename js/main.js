let map,
    markers = [];
let businessCategoriesEl,
    dataPickerEl1,
    dataPickerEl2;

function onDOMLoaded() {
    businessCategoriesEl = document.getElementById('business-categories');
    dataPickerEl1 = document.getElementById('data-picker-1');
    dataPickerEl2 = document.getElementById('data-picker-2');

    loadBusinessCategories();
}

async function loadBusinessCategories() {

    businessCategoriesEl.innerHTML = '';
    let businessCategories = await DataStore.getBusinessCategories();
    for (let {
            category,
            count
        } of businessCategories) {

        let li = document.createElement('li');
        li.textContent = category;
        li.addEventListener('click', (event) => {
            let activeBusinessCategoryEl = document.querySelector('#business-categories .active');
            if (activeBusinessCategoryEl) {
                activeBusinessCategoryEl.classList.remove('active');
            }
            li.classList.add('active');
            loadBusinesses(category);
        });

        businessCategoriesEl.appendChild(li);
    }

    document.querySelector('#business-categories li').click();
}


async function loadBusinesses(category) {
    let businesses = await DataStore.getBusinesses(category);
    console.log(businesses);
    showOnMap(businesses);
}


async function loadBusinessDetails(businessID) {
    let business = await DataStore.getBusinessDetails(businessID);
    console.log(business);

    reloadDashboard(business);
}

async function reloadDashboard(business) {
    showDataPicker1();
    // showRatingsPlot();
    // showTopicsPlot();
    showDataPicker2();
    // showCheckinsPlot();
}


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
            .bindPopup(business.name)
            .addTo(map)
            .on('mouseover', function (event) {
                this.openPopup();
            })
            .on('mouseout', function (event) {
                this.closePopup();
            })
            .on('click', (event) => {
                loadBusinessDetails(business.business_id);
            });
        markers.push(marker);
    }
    map.flyTo(new L.LatLng(businesses[0].latitude, businesses[0].longitude));
}

function myFunction() {
  var x = document.getElementById("trendYears").value;
  alert(x+" selected!")
}

onDOMLoaded();
