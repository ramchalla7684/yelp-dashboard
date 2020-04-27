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
            //TODO:
        });

        datePicker1.appendChild(li);
    }

    document.querySelector('#date-picker-1 li').click();
}

function showDataPicker2() {

}