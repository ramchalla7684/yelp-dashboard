let businessCategoriesEl;

function onDOMLoaded() {
    businessCategoriesEl = document.getElementById("business-categories");


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

        });

        businessCategoriesEl.appendChild(li);
    }
}

onDOMLoaded();