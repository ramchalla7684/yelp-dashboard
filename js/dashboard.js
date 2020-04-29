const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let business = null;

let lineChart,
    checkinsBarChart,
    ratingsBarChart,
    bubbleChart;

function setBusiness(_business) {
    business = _business;
}

function showBusinessName() {
    businessNameEl.textContent = business.name;
    businessAddressEl.textContent = business.address;
}

function showDataPicker1() {
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

            showLineChart(year);
            showBubbleChart(year);
            showCheckinsBarChart(year);
            showRatingsBarChart(year);
        });

        datePickerEl.appendChild(li);
    }

    document.querySelector('#date-picker li').click();
}


function showLineChart(year) {

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
        lineChart = new LineChart(year);
        lineChart.createSVG();
        lineChart.currentData = ratings;
        lineChart.init();
    } else {
        lineChart.currentData = ratings;
        lineChart.update();
    }
}

function showRatingsBarChart(year, month = null) {
    let _ratings = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    if (month == null) {
        for (let month = 0; month < 12; month++) {
            if (!business.ratings[year][month]) {
                continue;
            }

            for (let star = 1; star <= 5; star++) {
                if (!business.ratings[year][month].stars[star]) {
                    continue;
                }
                _ratings[star] += business.ratings[year][month].stars[star];
            }
        }
    } else {
        let monthIdx = MONTHS.indexOf(month);
        if (monthIdx === -1) {
            return;
        }
        if (!business.ratings[year][monthIdx]) {
            return;
        }

        for (let star = 1; star <= 5; star++) {
            if (!business.ratings[year][monthIdx].stars[star]) {
                continue;
            }
            _ratings[star] += business.ratings[year][monthIdx].stars[star];
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

function showBubbleChart(year) {

    console.log(business.keywords);
    let _keywords = {};
    for (let month in business.keywords[year]) {
        for (let keyword in business.keywords[year][month].keywords) {
            if (!_keywords[keyword]) {
                _keywords[keyword] = [];
            }

            _keywords[keyword] = _keywords[keyword].concat(business.keywords[year][month].keywords[keyword]);
        }
    }

    let countSentiment = (sentiments) => {
        let p = 0,
            n = 0,
            u = 0;
        for (let score of sentiments) {
            if (score > 0.2) {
                p += 1;
            } else if (score < 0) {
                n += 1;
            } else {
                u += 1;
            }
        }

        return {
            'nPositive': p,
            'nNegative': n,
            'nNeutral': u
        };
    }

    let sentimentScores = [];
    for (let keyword in _keywords) {
        let {
            nPositive,
            nNegative,
            nNeutral
        } = countSentiment(_keywords[keyword]);
        let nMentions = _keywords[keyword].length;
        sentimentScores.push({
            'keyword': keyword,
            'sentiment': (_keywords[keyword].reduce((a, b) => a + b) / Math.max(nMentions, 1)).toFixed(4),
            'frequency': nMentions,
            'n_mentions': nMentions,
            'n_positive': nPositive,
            'n_negative': nNegative,
            'n_neutral': nNeutral
        });
    }

    console.log(sentimentScores.length);

    let frequencyThreshold = 1;
    // sentimentScores = sentimentScores.filter(sentimentScore => sentimentScore['n_mentions'] > frequencyThreshold);
    // 2.5 < 8

    sentimentScores = sentimentScores.sort((a, b) => b['frequency'] - a['frequency']);
    sentimentScores = sentimentScores.splice(0, 30);
    sentimentScores = sentimentScores.filter(sentimentScore => sentimentScore['frequency'] * 2.5 >= 8);

    console.log(sentimentScores);

    if (!bubbleChart) {
        bubbleChart = new BubbleChart();
        bubbleChart.createSVG();
        bubbleChart.update(sentimentScores, true);
    } else {
        bubbleChart.update(sentimentScores, false);
    }
}

function showCheckinsBarChart(year) {

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