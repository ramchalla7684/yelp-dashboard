let businessCategoriesEl, dataPickerEl1, dataPickerEl2;

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
}


async function loadBusinessDetails(businessID) {
    let business = await DataStore.getBusinessDetails(businessID);
    console.log(business);

    activateDashboard(business);
}

async function reloadDashboard(business) {
    showDataPicker1();
    // showRatingsPlot();
    // showTopicsPlot();
    showDataPicker2();
    // showCheckinsPlot();
}

onDOMLoaded();