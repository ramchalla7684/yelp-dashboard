let businessCategoriesEl;

function onDOMLoaded() {
    businessCategoriesEl = document.getElementById('business-categories');


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

onDOMLoaded();