const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let lineChart,
    barChart;

function showBusinessName(business) {
    businessNameEl.textContent = business.name;
    businessAddressEl.textContent = business.address;
}

function showDataPicker1(business) {
    datePickerEl.innerHTML = '';

    for (let year in business.available_dates) {
        let li = document.createElement('li');
        li.textContent = year;
        li.addEventListener('click', (event) => {
            let activeYearEl = document.querySelector('#date-picker .active');
            if (activeYearEl) {
                activeYearEl.classList.remove('active');
            }
            li.classList.add('active');

            showLineChart(business, year);
            showBarChart(business, year);
        });

        datePickerEl.appendChild(li);
    }

    document.querySelector('#date-picker li').click();
}


function showLineChart(business, year) {

    let avgStars = (stars) => {
        let sum = 0,
            num = 0;
        for (let star in stars) {
            sum += Number(star) * Number(stars[star]);
            num += Number(stars[star]);
        }

        return {
            avg: (sum / Math.max(num, 1)).toFixed(2),
            num: num
        };
    }
    let ratings = [];
    for (let i = 0; i < 12; i++) {

        if (!(i in business.ratings[year])) {
            ratings.push({
                month: MONTHS[i],
                stars: 0,
                num: 0
            });
        } else {
            let {
                avg,
                num
            } = avgStars(business.ratings[year][i].stars);

            ratings.push({
                month: MONTHS[i],
                stars: avg,
                num: num
            });
        }
    }
    // console.log(ratings);

    if (!lineChart) {
        lineChart = new LineChart();
        lineChart.createSVG();
        lineChart.currentData = ratings;
        lineChart.init();
    } else {
        lineChart.currentData = ratings;
        lineChart.update();
    }
}

function showBarChart(business, year) {

    if (!(year in business.checkins)) {
        return;
    }

    let checkins = [];

    for (let i = 0; i < 12; i++) {

        if (!(i in business.checkins[year])) {
            checkins.push({
                month: MONTHS[i],
                checkins: 0
            });
        } else {
            checkins.push({
                month: MONTHS[i],
                checkins: business.checkins[year][i]
            });
        }
    }

    if (!barChart) {
        barChart = new BarChart();
        barChart.createSVG();
        barChart.currentData = checkins;
        barChart.init();
    } else {
        barChart.currentData = checkins;
        barChart.update();
    }
}