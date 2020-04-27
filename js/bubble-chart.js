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
var sentimentNames = {
    P: "Positive",
    N: "Negative",
    U: "Neutral"
};

var colorCodes = {
    P: "steelblue",
    N: "#C70039",
    U: "#E2DF14"
};

class BubbleChart {
    constructor() {
        this.width = 1200;
        this.height = 600;

        this.svg = null;
        this.circleSize = {
            min: 10,
            max: 80
        };
        this.node = null;
        this.forces = null;
    }

    createSVG() {
        this.svg = d3.select("#bubble-chart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    update(data) {
        d3.selectAll("#bubble-chart svg > *").remove();
        let frequencies = data.map(function (word) {
            return +word.frequency;
        });
        let frequencyExtent = d3.extent(frequencies);
        let sentiment_scores = data.map(function (word) {
            return +word.sentiment;
        });

        let sentimentExtent = d3.extent(sentiment_scores);
        let sentiments = Object.keys(sentimentNames);

        let circleRadiusScale = d3.scaleSqrt()
            .domain(frequencyExtent)
            .range([this.circleSize.min, this.circleSize.max]);

        this.toggleSentimentKey(sentiments, true);
        this.createCircles(data, circleRadiusScale);
        this.createForces(sentimentExtent, frequencyExtent);
        this.createForceSimulation(circleRadiusScale);
        // addGroupingListeners();
    }

    toggleSentimentKey(sentiments, showSentimentKey) {
        var keyElementWidth = 150,
            keyElementHeight = 30;
        var onScreenYOffset = keyElementHeight * 1.5,
            offScreenYOffset = 100;


        let createSentimentKey = () => {
            var keyWidth = keyElementWidth * sentiments.length;
            var sentimentKeyScale = d3.scaleBand()
                .domain(sentiments)
                .range([(this.width - keyWidth) / 2, (this.width + keyWidth) / 2]);

            this.svg.append("g")
                .attr("class", "sentiment-key")
                .attr("transform", "translate(0," + (this.height + offScreenYOffset) + ")")
                .selectAll("g")
                .data(sentiments)
                .enter()
                .append("g")
                .attr("class", "sentiment-key-element");

            d3.selectAll("g.sentiment-key-element")
                .append("rect")
                .attr("width", keyElementWidth)
                .attr("height", keyElementHeight)
                .attr("x", function (d) {
                    return sentimentKeyScale(d);
                })
                .attr("fill", function (d) {
                    if (d == "P") {
                        return colorCodes["P"];
                    } else if (d == "N") {
                        return colorCodes["N"];
                    } else {
                        return colorCodes["U"];
                    }
                });

            d3.selectAll("g.sentiment-key-element")
                .append("text")
                .attr("text-anchor", "middle")
                .attr("x", function (d) {
                    return sentimentKeyScale(d) + keyElementWidth / 2;
                })
                .text(function (d) {
                    return sentimentNames[d];
                });

            // The text BBox has non-zero values only after rendering
            d3.selectAll("g.sentiment-key-element text")
                .attr("y", function (d) {
                    var textHeight = this.getBBox().height;
                    // The BBox.height property includes some extra height we need to remove
                    var unneededTextHeight = 4;
                    return ((keyElementHeight + textHeight) / 2) - unneededTextHeight;
                });
        }


        if (d3.select(".sentiment-key").empty()) {
            createSentimentKey();
        }
        var sentimentKey = d3.select(".sentiment-key");

        if (showSentimentKey) {
            translateSentimentKey("translate(0," + (this.height - onScreenYOffset) + ")");
        } else {
            translateSentimentKey("translate(0," + (this.height + offScreenYOffset) + ")");
        }

        function translateSentimentKey(translation) {
            sentimentKey
                .transition()
                .duration(500)
                .attr("transform", translation);
        }
    }


    createCircles(data, circleRadiusScale) {
        var formatFrequency = d3.format(",");
        var nodes = svg.append("g")
            .attr("class", "nodes");
        
        this.node = nodes.selectAll("node")
            .data(data)
            .enter()
            .append("g");
    
        var circle = this.node.append("circle")
            .attr("r", function(d) { return circleRadiusScale(d.frequency); })
            .on("mouseover", function(d) {
                updateWordInfo(d);
            })
            .on("mouseout", function(d) {
                updateWordInfo();
            });
    
        var text = this.node.append("text")
            .text(function(d) {
                        return d.phrase; })
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.frequency*3; })
            .attr("fill", "black");

        this.updateCircles();

        function updateWordInfo(word) {
            var info = "";
            if (word) {
                info = `${word.phrase} <br> Frequency: ${formatFrequency(word.frequency)} <br> Sentiment: ${word.sentiment}`;
            }
            d3.select("#word-info").html(info);
        }
    }

    updateCircles() {
        this.node
            .attr("fill", function (d) {
                if (d["sentiment"] > 0.1) {
                    return colorCodes["P"];
                } else if (d["sentiment"] < -0.1) {
                    return colorCodes["N"];
                } else {
                    return colorCodes["U"];
                }
            });
    }

    createForces(sentimentExtent, frequencyExtent) {
        var forceStrength = 0.08;

        function createCombineForces(width, height, forceStrength) {
            return {
                x: d3.forceX(width / 2).strength(forceStrength),
                y: d3.forceY(height / 2).strength(forceStrength)
            };
        }

        function createSentimentForces(width, height, forceStrength) {
            return {
                x: d3.forceX((d) => sentimentForceX(d, width)).strength(forceStrength),
                y: d3.forceY((d) => sentimentForceY(d, height)).strength(forceStrength)
            };

            function sentimentForceX(d, width) {
                if (d.sentiment < -0.1) {
                    return left(width);
                } else if (d.sentiment > 0.1) {
                    return right(width);
                } else {
                    return center(width);
                }
            }

            function sentimentForceY(d, height) {
                if ((d.sentiment < -0.1) || (d.sentiment > 0.1)) {
                    return top(height);
                } else {
                    return bottom(height);
                }
            }

            function left(dimension) {
                return dimension / 4;
            }

            function center(dimension) {
                return dimension / 2;
            }

            function right(dimension) {
                return dimension / 4 * 3;
            }

            function top(dimension) {
                return dimension / 4;
            }

            function bottom(dimension) {
                return dimension / 4 * 3;
            }
        }

        function createFrequencyForces(circleSize, sentimentExtent, frequencyExtent) {
            var scaledFrequencyMargin = circleSize.max;

            let frequencyScaleX = d3.scaleLinear()
                .domain(sentimentExtent)
                .range([scaledFrequencyMargin, width - scaledFrequencyMargin * 2]);
            let frequencyScaleY = d3.scaleLinear()
                .domain(frequencyExtent)
                .range([height - scaledFrequencyMargin, scaledFrequencyMargin * 2]);

            return {
                x: d3.forceX(function (d) {
                    return frequencyScaleX(d.sentiment);
                }).strength(forceStrength),
                y: d3.forceY(function (d) {
                    return frequencyScaleY(d.frequency);
                }).strength(forceStrength)
            };
        }

        this.forces = {
            combine: createCombineForces(this.width, this.height, forceStrength),
            sentiment: createSentimentForces(this.width, this.height, forceStrength),
            frequency: createFrequencyForces(this.circleSize, sentimentExtent, frequencyExtent)
        };
    }


    createForceSimulation(circleRadiusScale) {
        let forceSimulation = d3.forceSimulation()
            .force("x", this.forces.combine.x)
            .force("y", this.forces.combine.y)
            .force("collide", d3.forceCollide((d) => frequencyGrouping() ? 0 : circleRadiusScale(d.frequency) + 1));
        forceSimulation.nodes(data)
            .on("tick", () => {

                this.node
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    });
            });
    }
}

//default rating
let data = words.filter(function (d) {
    return (d.rating == "1");
});

let bubbleChart = new BubbleChart();
bubbleChart.createSVG();
bubbleChart.update(data);

//function to update rating
$('.star').on('click', function () {
    $('.star').addClass('selected');
    var count = $(this).attr('name');
    for (var i = 0; i < count - 1; i++) {
        $('.star').eq(i).removeClass('selected');
    }
    data = words.filter(function (d) {
        return (d.rating == 6 - count);
    });
    update_data(data);

});

function isChecked(elementID) {
    return d3.select(elementID).property("checked");
}


function frequencyGrouping() {
    return isChecked("#frequency");
}

// function addGroupingListeners() {
//     addListener("#combine", forces.combine);
//     addListener("#sentiments", forces.sentiment);
//     addListener("#frequency", forces.frequency);

//     function addListener(selector, forces) {
//         d3.select(selector).on("click", function () {
//             updateForces(forces);
//             toggleSentimentKey(!frequencyGrouping());
//             toggleFrequencyAxes(frequencyGrouping());
//         });
//     }

//     function updateForces(forces) {
//         forceSimulation
//             .force("x", forces.x)
//             .force("y", forces.y)
//             .force("collide", d3.forceCollide(forceCollide))
//             .alphaTarget(0.5)
//             .restart();
//     }

//     function toggleFrequencyAxes(showAxes) {
//         var onScreenXOffset = 50,
//             offScreenXOffset = -40;
//         var onScreenYOffset = 50,
//             offScreenYOffset = 100;

//         if (d3.select(".x-axis").empty()) {
//             createAxes();
//         }
//         var xAxis = d3.select(".x-axis"),
//             yAxis = d3.select(".y-axis");
//         var xLabel = d3.select(".x-label"),
//             yLabel = d3.select(".y-label");

//         if (showAxes) {
//             translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
//             translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
//             xLabel
//                 .attr("x", width - 570)
//                 .attr("y", height - 6)
//             yLabel
//                 .attr("y", width - 1180)
//                 .attr("x", height - 900)
//         } else {
//             translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
//             translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
//             xLabel
//                 .attr("x", width + 570)
//             yLabel
//                 .attr("x", height + 900)
//         }

//         function createAxes() {
//             var numberOfTicks = 10,
//                 tickFormatY = ".0s";
//             tickFormatX = ".1f";

//             var xAxis = d3.axisBottom(frequencyScaleX)
//                 .ticks(numberOfTicks, tickFormatX);

//             svg.append("g")
//                 .attr("class", "x-axis")
//                 .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
//                 .call(xAxis)
//             svg.append("text")
//                 .attr("class", "x-label")
//                 .attr("text-anchor", "end")
//                 .text("Sentiment Score");

//             var yAxis = d3.axisLeft(frequencyScaleY)
//                 .ticks(numberOfTicks, tickFormatY);
//             svg.append("g")
//                 .attr("class", "y-axis")
//                 .attr("transform", "translate(" + offScreenXOffset + ",0)")
//                 .call(yAxis);

//             svg.append("text")
//                 .attr("class", "y-label")
//                 .attr("text-anchor", "end")
//                 .attr("transform", "rotate(-90)")
//                 .text("Frequency");
//         }

//         function translateAxis(axis, translation) {
//             axis
//                 .transition()
//                 .duration(500)
//                 .attr("transform", translation);
//         }
//     }
// }