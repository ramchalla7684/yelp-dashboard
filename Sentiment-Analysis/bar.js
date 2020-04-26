//dummy data
var words = [{
        rating: "1",
        phrase: "mac cheese",
        sentiment: "0.8",
        frequency: "10"
    },
    {
        rating: "1",
        phrase: "gabi good",
        sentiment: "0.5",
        frequency: "5"
    },
    {
        rating: "1",
        phrase: "steak knife",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "1",
        phrase: "service",
        sentiment: "-0.8",
        frequency: "1"
    },
    {
        rating: "2",
        phrase: "washroom",
        sentiment: "0.7",
        frequency: "10"
    },
    {
        rating: "2",
        phrase: "dirty",
        sentiment: "-0.5",
        frequency: "5"
    },
    {
        rating: "2",
        phrase: "clean",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "2",
        phrase: "tasty",
        sentiment: "0.8",
        frequency: "1"
    },
    {
        rating: "3",
        phrase: "mushroom",
        sentiment: "-0.7",
        frequency: "10"
    },
    {
        rating: "3",
        phrase: "not good",
        sentiment: "-0.5",
        frequency: "5"
    },
    {
        rating: "3",
        phrase: "DBC",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "3",
        phrase: "yummy",
        sentiment: "0.8",
        frequency: "1"
    },
    {
        rating: "4",
        phrase: "best steak",
        sentiment: "0.7",
        frequency: "10"
    },
    {
        rating: "4",
        phrase: "great view",
        sentiment: "0.5",
        frequency: "5"
    },
    {
        rating: "4",
        phrase: "creme brule",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "4",
        phrase: "waiter",
        sentiment: "-0.2",
        frequency: "1"
    },
    {
        rating: "5",
        phrase: "wine list",
        sentiment: "0.9",
        frequency: "10"
    },
    {
        rating: "5",
        phrase: "dinner",
        sentiment: "0.5",
        frequency: "5"
    },
    {
        rating: "5",
        phrase: "food",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "5",
        phrase: "fondue",
        sentiment: "0.8",
        frequency: "1"
    }
]

//function to update data
function update_data(count) {
    data = words.filter(function (d) {
        return (d.rating == 6 - count);
    });

    y.domain(data.map(function (d) {
        return d.phrase;
    }));
    // yAxis.scale(y);

    d3.selectAll(".rectangle")
        .data(data)
        .transition()
        .style("fill", function (d) {
            if (d["sentiment"] < 0) {
                return "#C70039";
            } else {
                return "steelblue";
            }
        })
        .attr("width", function (d) {
            if (d["sentiment"] < 0) {

                return width / 2 - x(+d["sentiment"]);
            } else {
                return x(+d["sentiment"]) - width / 2;
            }
        })
        .attr("y", function (d, i) {
            return (height / data.length) * i;
        })
        .attr("x", function (d) {
            if (d["sentiment"] < 0) {
                return x(+d["sentiment"]);
            } else {
                return width / 2;
            }
        })
        .ease("linear")
        .select("title")
        .text(function (d) {
            return d.phrase + " : " + d["sentiment"];
        });

    d3.selectAll("g.y.axis")
        .transition()
        .call(yAxis);
}
data = words.filter(function (d) {
    return (d.rating == "1");
});
var margin = {
        top: 0,
        right: 180,
        bottom: 220,
        left: 250
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

window.x = d3.scale.linear()
    .domain([-1, 1])
    .range([0, width]);
window.y = d3.scale.ordinal()
    .domain(data.map(function (d) {
        return d.phrase;
    }))
    .rangeBands([0, height]);


window.xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

window.yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "11px")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");


svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.selectAll("rectangle")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "rectangle")
    .style("fill", function (d) {
        if (d["sentiment"] < 0) {
            return "#C70039";
        } else {
            return "steelblue";
        }
    })
    .attr("height", height / data.length)
    .attr("width", function (d) {
        if (d["sentiment"] < 0) {

            return width / 2 - x(+d["sentiment"]);
        } else {
            return x(+d["sentiment"]) - width / 2;
        }
    })
    .attr("y", function (d, i) {
        return (height / data.length) * i;
    })
    .attr("x", function (d) {
        if (d["sentiment"] < 0) {
            return x(+d["sentiment"]);
        } else {
            return width / 2;
        }
    })
    .append("title")
    .text(function (d) {
        return d.phrase + " : " + d["sentiment"];
    });


$('.star').on('click', function () {
    $('.star').addClass('selected');
    var count = $(this).attr('name');
    for (var i = 0; i < count - 1; i++) {
        $('.star').eq(i).removeClass('selected');
    }
    update_data(count);

});