const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let lineChart,
    checkinsBarChart,
    ratingsBarChart;

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
            showBubbleChart(business, year);
            showCheckinsBarChart(business, year);
            showRatingsBarChart(business, year);
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
    for (let month = 0; month < 12; month++) {

        if (!business.ratings[year][month]) {
            ratings.push({
                month: MONTHS[month],
                stars: 0,
                num: 0
            });
        } else {
            let {
                avg,
                num
            } = avgStars(business.ratings[year][month].stars);

            ratings.push({
                month: MONTHS[month],
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

function showBubbleChart(business, year) {

}

function showCheckinsBarChart(business, year) {

    if (!business.checkins[year]) {
        return;
    }

    let checkins = [];

    for (let month = 0; month < 12; month++) {

        if (!business.checkins[year][month]) {
            checkins.push({
                month: MONTHS[month],
                checkins: 0
            });
        } else {
            checkins.push({
                month: MONTHS[month],
                checkins: business.checkins[year][month]
            });
        }
    }

    if (!checkinsBarChart) {
        checkinsBarChart = new CheckinsBarChart();
        checkinsBarChart.createSVG();
        checkinsBarChart.currentData = checkins;
        checkinsBarChart.init();
    } else {
        checkinsBarChart.currentData = checkins;
        checkinsBarChart.update();
    }
}

function showRatingsBarChart(business, year) {
    let _ratings = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    for (let month = 0; month < 12; month++) {
        if (!business.ratings[year][month]) {
            continue;
        }

        for (let star = 1; star <= 5; star++) {

            // if (!_ratings[star]) {
            //     _ratings[star] = 0;
            // }

            if (!business.ratings[year][month].stars[star]) {
                continue;
            }
            _ratings[star] += business.ratings[year][month].stars[star];
        }
    }

    let ratings = [];
    for (let star = 1; star <= 5; star++) {
        ratings.push({
            stars: star,
            num: _ratings[star]
        });
    }

    if (!ratingsBarChart) {
        ratingsBarChart = new RatingsBarChart();
        ratingsBarChart.createSVG();
        ratingsBarChart.currentData = ratings;
        ratingsBarChart.init();
    } else {
        ratingsBarChart.currentData = ratings;
        ratingsBarChart.update();
    }
}