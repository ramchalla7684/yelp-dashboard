var margin = {
        top: 30,
        right: 120,
        bottom: 30,
        left: 50
    },
    width = 560 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    tooltip = {
        width: 100,
        height: 100,
        x: 10,
        y: -30
    };

var parseDate = d3.timeParse("%m/%e/%Y"),
    bisectDate = d3.bisector(function (d) {
        return d.date;
    }).left,
    formatValue = d3.format(","),
    dateFormatter = d3.timeFormat("%m/%d/%y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);



var line = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.likes);
    });

var svg = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var all_data = [{
        'name': 'daily',
        'data': [{
                "date": "1/1/2015",
                "likes": "1"
            },
            {
                "date": "1/2/2015",
                "likes": "1.5"
            },
            {
                "date": "1/3/2015",
                "likes": "1.7"
            },
            {
                "date": "1/4/2015",
                "likes": "1.8"
            },
            {
                "date": "1/5/2015",
                "likes": "2.0"
            },
            {
                "date": "1/6/2015",
                "likes": "2.5"
            },


            {
                "date": "2/1/2015",
                "likes": "3.4"
            },
            {
                "date": "2/10/2015",
                "likes": "3.7"
            },
            {
                "date": "2/11/2015",
                "likes": "4.0"
            },
            {
                "date": "3/12/2015",
                "likes": "4.2"
            },
            {
                "date": "3/13/2015",
                "likes": "4.4"
            },
            {
                "date": "3/14/2015",
                "likes": "4.3"
            },
            {
                "date": "3/15/2015",
                "likes": "4.8"
            },
            {
                "date": "3/16/2015",
                "likes": "4.9"
            }
        ]
    },
    {
        'name': 'weekly',
        'data': [{
                "date": "10/1/2015",
                "likes": "3"
            },
            {
                "date": "10/7/2015",
                "likes": "4"
            },
            {
                "date": "10/14/2015",
                "likes": "1.7"
            },
            {
                "date": "10/21/2015",
                "likes": "2.8"
            },
            {
                "date": "11/7/2015",
                "likes": "4"
            },
            {
                "date": "11/14/2015",
                "likes": "1.7"
            },
            {
                "date": "11/21/2015",
                "likes": "2.8"
            }
        ]
    },
    {
        'name': 'monthly',
        'data': [{
                "date": "1/1/2015",
                "likes": "4"
            },
            {
                "date": "2/1/2015",
                "likes": "1.7"
            },
            {
                "date": "3/1/2015",
                "likes": "2.8"
            }
        ]
    }
];

currentData = JSON.parse(JSON.stringify(all_data[0].data));
currentData.forEach(function (d) {
    d.date = parseDate(d.date);
    d.likes = +d.likes;
});

x.domain([currentData[0].date, currentData[currentData.length - 1].date]);
y.domain([1, 5]);


svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));


var path = svg.append("path")
    .datum(currentData)
    .attr("class", "line")
    .attr("d", line);

const pathLength = path.node().getTotalLength();


// D3 provides lots of transition options, have a play around here:
// https://github.com/d3/d3-transition
const transitionPath = d3
    .transition()
    .ease(d3.easeSin)
    .duration(2500);
path
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)

    .transition(transitionPath).on("end", function () {

        svg.selectAll(".dot")
            .data(currentData)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot")
            .attr("cx", function (d, i) {
                return x(d.date)
            })
            .attr("cy", function (d) {
                return y(d.likes)
            })
            .attr("r", 5);
    })
    .attr("stroke-dashoffset", 0)

var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");



focus.append("rect")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 50)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);

focus.append("text")
    .attr("class", "tooltip-date")
    .attr("x", 18)
    .attr("y", -2);

focus.append("text")
    .attr("x", 18)
    .attr("y", 18)
    .text("Likes:");

focus.append("text")
    .attr("class", "tooltip-likes")
    .attr("x", 60)
    .attr("y", 18);

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function () {
        focus.style("display", null);
    })
    .on("mouseout", function () {
        focus.style("display", "none");
    })
    .on("mousemove", mousemove);

function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(currentData, x0, 1),
        d0 = currentData[i - 1],
        d1 = currentData[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.likes) + ")");
    focus.select(".tooltip-date").text(dateFormatter(d.date));
    focus.select(".tooltip-likes").text(formatValue(d.likes));
}

function updateChart(data) {
    console.log("currentData: " + JSON.stringify(data))
    data = JSON.parse(JSON.stringify(data));
    data.forEach(function (d) {
        console.log("date: " + d.date)
        console.log("likes: " + d.likes + " : " + typeof d.likes)
        d.date = parseDate(d.date);
        d.likes = +d.likes;
    });

    currentData = data;
    x = x.domain([currentData[0].date, currentData[currentData.length - 1].date]);
    y = y.domain([1, 5]);
    svg.select(".x-axis").remove();


    svg.select(".y-axis").remove();
    svg.selectAll(".dot").remove();

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));


    var path = svg.select("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    const pathLength = path.node().getTotalLength();

    const transitionPath = d3
        .transition()
        .ease(d3.easeSin)
        .duration(2500);
    path
        .attr("stroke-dashoffset", pathLength)
        .attr("stroke-dasharray", pathLength)
        .transition(transitionPath).on("end", function () {

            svg.selectAll(".dot")
                .data(currentData)
                .enter().append("circle") // Uses the enter().append() method
                .attr("class", "dot")
                .attr("cx", function (d, i) {
                    return x(d.date)
                })
                .attr("cy", function (d) {
                    return y(d.likes)
                })
                .attr("r", 5);
        })
        .attr("stroke-dashoffset", 0);

}

async function getRatings(value) {
    alert("Hiii: " + value)
    let ratingsData = await DataStore.getRatings(value);
    console.log(ratingsData);
    updateChart(ratingsData[0].data);
    //  reloadDashboard(ratingsData);
}