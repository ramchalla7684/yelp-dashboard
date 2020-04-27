function showBusinessName(business) {
    businessNameEl.textContent = business.name;
    businessAddressEl.textContent = business.address;
}

function showDataPicker1(availableDates) {
    datePicker1.innerHTML = '';

    for (let year in availableDates) {
        let li = document.createElement('li');
        li.textContent = year;
        li.addEventListener('click', (event) => {
            let activeYearEl = document.querySelector('#date-picker-1 .active');
            if (activeYearEl) {
                activeYearEl.classList.remove('active');
            }
            li.classList.add('active');

            showDataPicker2(Object.keys(availableDates[year]));
        });

        datePicker1.appendChild(li);
    }

    document.querySelector('#date-picker-1 li').click();
}

function showDataPicker2(quarters) {
    datePicker2.innerHTML = '';

    let quartersTxt = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];

    for (let quarter of quarters) {
        let li = document.createElement('li');
        li.textContent = quartersTxt[quarter];
        li.addEventListener('click', (event) => {
            let activeQuarterEl = document.querySelector('#date-picker-2 .active');
            if (activeQuarterEl) {
                activeQuarterEl.classList.remove('active');
            }
            li.classList.add('active');
            //TODO:
        });

        datePicker2.appendChild(li);
    }

    document.querySelector('#date-picker-2 li').click();
}