let map,
    markers = [];
let businessCategoriesEl,
    datePicker1;

function onDOMLoaded() {
    businessCategoriesEl = document.getElementById('business-categories');
    datePicker1 = document.querySelector('#date-picker-1 ul');

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
    showDataPicker1(business.available_dates);
    // showRatingsPlot();
    // showTopicsPlot();
    // showDataPicker2();
    // showCheckinsPlot();
}

function myFunction() {
    var x = document.getElementById("trendYears").value;
    alert(x + " selected!")
}

onDOMLoaded();