let map,
    markers = [];
let businessCategoriesEl,
    businessNameEl,
    businessAddressEl,
    datePickerEl,
    lineChartTitleEl,
    ratingsChartTitleEl,
    bubbleChartTitleEl,
    barChartTitleEl,
    barChartEl;

function onDOMLoaded() {
    businessCategoriesEl = document.querySelector('#business-categories');
    businessNameEl = document.querySelector('#business-name');
    businessAddressEl = document.querySelector('#business-address span');
    datePickerEl = document.querySelector('#date-picker ul');

    lineChartTitleEl = document.querySelector("#line-chart-title");
    ratingsChartTitleEl = document.querySelector("#ratings-chart-title");
    bubbleChartTitleEl = document.querySelector("#bubble-chart-title");
    barChartTitleEl = document.querySelector("#bar-chart-title");

    barChartEl = document.querySelector("#bar-chart");

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
    // console.log(businesses);
    showOnMap(businesses);
}


async function loadBusinessDetails(businessID) {
    let business = await DataStore.getBusinessDetails(businessID);
    // console.log(business);

    setBusiness(business);
    reloadDashboard();
}

async function reloadDashboard() {
    showBusinessName();
    showDataPicker1();
    // showRatingsPlot();
    // showTopicsPlot();
    // showCheckinsPlot();
}

function myFunction() {
    var x = document.getElementById("trendYears").value;
    alert(x + " selected!")
}

onDOMLoaded();