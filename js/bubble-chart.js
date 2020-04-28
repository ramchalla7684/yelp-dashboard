//dummy data
var words = [{
        rating: "1",
        keyword: "mac cheese",
        sentiment: "0.8",
        frequency: 10
    },
    {
        rating: "1",
        keyword: "gabi good",
        sentiment: "0.5",
        frequency: "5"
    },
    {
        rating: "1",
        keyword: "steak knife",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "1",
        keyword: "service",
        sentiment: "-0.8",
        frequency: "1"
    },
    {
        rating: "2",
        keyword: "washroom",
        sentiment: "0.7",
        frequency: "10"
    },
    {
        rating: "2",
        keyword: "dirty",
        sentiment: "-0.5",
        frequency: "5"
    },
    {
        rating: "2",
        keyword: "clean",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "2",
        keyword: "tasty",
        sentiment: "0.8",
        frequency: "1"
    },
    {
        rating: "3",
        keyword: "mushroom",
        sentiment: "-0.7",
        frequency: "10"
    },
    {
        rating: "3",
        keyword: "not good",
        sentiment: "-0.5",
        frequency: "5"
    },
    {
        rating: "3",
        keyword: "DBC",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "3",
        keyword: "yummy",
        sentiment: "0.8",
        frequency: "1"
    },
    {
        rating: "4",
        keyword: "best steak",
        sentiment: "0.7",
        frequency: "10"
    },
    {
        rating: "4",
        keyword: "great view",
        sentiment: "0.5",
        frequency: "5"
    },
    {
        rating: "4",
        keyword: "creme brule",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "4",
        keyword: "waiter",
        sentiment: "-0.2",
        frequency: "1"
    },
    {
        rating: "5",
        keyword: "wine list",
        sentiment: "0.9",
        frequency: "10"
    },
    {
        rating: "5",
        keyword: "dinner",
        sentiment: "0.5",
        frequency: "5"
    },
    {
        rating: "5",
        keyword: "food",
        sentiment: "0.1",
        frequency: "3"
    },
    {
        rating: "5",
        keyword: "fondue",
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
        this.margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        };
        this.width = 1100 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        this.svg = null;
        this.circleSize = {
            min: 10,
            max: 50
        };
        this.circleRadiusScale = null;
        this.node = null;
        this.forces = null;
        this.forceSimulation = null;

        this.frequencyScaleX = null;
        this.frequencyScaleY = null;
    }

    createSVG() {
        this.svg = d3.select("#bubble-chart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    update(data, firstTime) {
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

        this.circleRadiusScale = d3.scaleSqrt()
            .domain(frequencyExtent)
            .range([this.circleSize.min, this.circleSize.max]);

        document.getElementById("combine").checked = false;
        document.getElementById("sentiments").checked = false;
        document.getElementById("frequency").checked = false;

        if (!firstTime) {
            this.forceSimulation.stop();
        }

        this.toggleSentimentKey(sentiments, true);
        this.createCircles(data);
        this.createForces(sentimentExtent, frequencyExtent);
        this.createForceSimulation(data);
        this.addGroupingListeners();
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


    createCircles(data) {
        var formatFrequency = d3.format(",");
        var nodes = this.svg.append("g")
            .attr("class", "nodes");

        this.node = nodes.selectAll("node")
            .data(data)
            .enter()
            .append("g");

        var circle = this.node.append("circle")
            .attr('class', 'bubble')
            .attr("r", (d) => {
                return this.circleRadiusScale(d.frequency);
            })
            .on("mouseover", function (d) {
                updateWordInfo(d);
            })
            .on("mouseout", function (d) {
                updateWordInfo();
            });

        var text = this.node.append("text")
            .text(function (d) {
                if (d.frequency * 2 < 8) {
                    return "";
                }
                return d.keyword;
            })
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", function (d) {
                return Math.min(d.frequency * 2, 13);
            })
            .attr("fill", "black");

        this.updateCircles();

        function updateWordInfo(word) {
            var info = "";
            if (word) {
                info = `${word.keyword} <br> Frequency: ${formatFrequency(word.frequency)} <br> Sentiment: ${word.sentiment}`;
            }
            d3.select("#word-info").html(info);
        }
    }

    updateCircles() {
        this.node
            .attr("fill", function (d) {
                if (d["sentiment"] > 0.2) {
                    return colorCodes["P"];
                } else if (d["sentiment"] < 0) {
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

        let createFrequencyForces = (width, height, circleSize, sentimentExtent, frequencyExtent) => {
            var scaledFrequencyMargin = circleSize.max;

            this.frequencyScaleX = d3.scaleLinear()
                .domain(sentimentExtent)
                .range([scaledFrequencyMargin, width - scaledFrequencyMargin * 2]);
            this.frequencyScaleY = d3.scaleLinear()
                .domain(frequencyExtent)
                .range([height - scaledFrequencyMargin, scaledFrequencyMargin * 2]);

            return {
                x: d3.forceX((d) => {
                    return this.frequencyScaleX(d.sentiment);
                }).strength(forceStrength),
                y: d3.forceY((d) => {
                    return this.frequencyScaleY(d.frequency);
                }).strength(forceStrength)
            };
        }

        this.forces = {
            combine: createCombineForces(this.width, this.height, forceStrength),
            sentiment: createSentimentForces(this.width, this.height, forceStrength),
            frequency: createFrequencyForces(this.width, this.height, this.circleSize, sentimentExtent, frequencyExtent)
        };
    }


    createForceSimulation(data) {
        this.forceSimulation = d3.forceSimulation()
            .force("x", this.forces.combine.x)
            .force("y", this.forces.combine.y)
            .force("collide", d3.forceCollide((d) => frequencyGrouping() ? 0 : this.circleRadiusScale(d.frequency) + 1));
        this.forceSimulation.nodes(data)
            .on("tick", () => {

                this.node
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    });

            });
    }

    addGroupingListeners() {

        let updateForces = (forces, forceSimulation) => {
            forceSimulation
                .force("x", forces.x)
                .force("y", forces.y)
                .force("collide", d3.forceCollide((d) => frequencyGrouping() ? 0 : this.circleRadiusScale(d.frequency) + 1))
                .alphaTarget(0.5)
                .restart();
        }


        let addListener = (selector, forces) => {
            d3.select(selector).on("click", () => {
                updateForces(forces, this.forceSimulation);
                this.toggleSentimentKey(!frequencyGrouping());
                toggleFrequencyAxes(frequencyGrouping());
            });
        };

        addListener("#combine", this.forces.combine);
        addListener("#sentiments", this.forces.sentiment);
        addListener("#frequency", this.forces.frequency);


        let toggleFrequencyAxes = (showAxes) => {
            var onScreenXOffset = 50,
                offScreenXOffset = -40;
            var onScreenYOffset = 50,
                offScreenYOffset = 100;

            let createAxes = () => {
                var numberOfTicks = 10,
                    tickFormatY = ".0s",
                    tickFormatX = ".1f";

                var xAxis = d3.axisBottom(this.frequencyScaleX)
                    .ticks(numberOfTicks, tickFormatX);

                this.svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + (this.height + offScreenYOffset) + ")")
                    .call(xAxis)
                this.svg.append("text")
                    .attr("class", "x-label")
                    .attr("text-anchor", "end")
                    .text("Sentiment Score");

                var yAxis = d3.axisLeft(this.frequencyScaleY)
                    .ticks(numberOfTicks, tickFormatY);
                this.svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + offScreenXOffset + ",0)")
                    .call(yAxis);

                this.svg.append("text")
                    .attr("class", "y-label")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .text("Frequency");
            };


            if (d3.select(".x-axis").empty()) {
                createAxes();
            }
            var xAxis = d3.select(".x-axis"),
                yAxis = d3.select(".y-axis");
            var xLabel = d3.select(".x-label"),
                yLabel = d3.select(".y-label");

            if (showAxes) {
                translateAxis(xAxis, "translate(0," + (this.height - onScreenYOffset) + ")");
                translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
                xLabel
                    .attr("x", this.width - 570)
                    .attr("y", this.height - 6)
                yLabel
                    .attr("y", this.width - 1180)
                    .attr("x", this.height - 900)
            } else {
                translateAxis(xAxis, "translate(0," + (this.height + offScreenYOffset) + ")");
                translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
                xLabel
                    .attr("x", this.width + 570)
                yLabel
                    .attr("x", this.height + 900)
            }

            function translateAxis(axis, translation) {
                axis
                    .transition()
                    .duration(500)
                    .attr("transform", translation);
            }
        };
    }
}

// default rating
// let data = words.filter(function (d) {
//     return true
// });

// console.log(data);

// bubbleChart = new BubbleChart();
// bubbleChart.createSVG();
// bubbleChart.update(data, true);


$('.star').addClass('selected');
for (var i = 0; i < 5 - 1; i++) {
    $('.star').eq(i).removeClass('selected');
}

//function to update rating
$('.star').on('click', function () {
    $('.star').addClass('selected');
    var count = $(this).attr('name');
    for (var i = 0; i < count - 1; i++) {
        $('.star').eq(i).removeClass('selected');
    }
    data = words.filter(function (d) {
        return (d.rating == 1);
    });
    bubbleChart.update(data, false);
});

function isChecked(elementID) {
    return d3.select(elementID).property("checked");
}


function frequencyGrouping() {
    return isChecked("#frequency");
}

function addGroupingListeners() {
    addListener("#combine", forces.combine);
    addListener("#sentiments", forces.sentiment);
    addListener("#frequency", forces.frequency);

    function addListener(selector, forces) {
        d3.select(selector).on("click", function () {
            updateForces(forces);
            toggleSentimentKey(!frequencyGrouping());
            toggleFrequencyAxes(frequencyGrouping());
        });
    }

    function updateForces(forces) {
        forceSimulation
            .force("x", forces.x)
            .force("y", forces.y)
            .force("collide", d3.forceCollide(forceCollide))
            .alphaTarget(0.5)
            .restart();
    }

    function toggleFrequencyAxes(showAxes) {
        var onScreenXOffset = 50,
            offScreenXOffset = -40;
        var onScreenYOffset = 50,
            offScreenYOffset = 100;

        if (d3.select(".x-axis").empty()) {
            createAxes();
        }
        var xAxis = d3.select(".x-axis"),
            yAxis = d3.select(".y-axis");
        var xLabel = d3.select(".x-label"),
            yLabel = d3.select(".y-label");

        if (showAxes) {
            translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
            translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
            xLabel
                .attr("x", width - 570)
                .attr("y", height - 6)
            yLabel
                .attr("y", width - 1180)
                .attr("x", height - 900)
        } else {
            translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
            translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
            xLabel
                .attr("x", width + 570)
            yLabel
                .attr("x", height + 900)
        }

        function createAxes() {
            var numberOfTicksX = (sentimentExtent[1] - sentimentExtent[0]) * 10,
                numberOfTicksY = frequencyExtent[1] - frequencyExtent[0],
                tickFormatY = ".0s";
            tickFormatX = ".1f";

            var xAxis = d3.axisBottom(frequencyScaleX)
                .ticks(numberOfTicksX, tickFormatX);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
                .call(xAxis)
            svg.append("text")
                .attr("class", "x-label")
                .attr("text-anchor", "end")
                .text("Sentiment Score");

            var yAxis = d3.axisLeft(frequencyScaleY)
                .ticks(numberOfTicksY, tickFormatY);
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + offScreenXOffset + ",0)")
                .call(yAxis);

            svg.append("text")
                .attr("class", "y-label")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .text("Frequency");
        }

        function translateAxis(axis, translation) {
            axis
                .transition()
                .duration(500)
                .attr("transform", translation);
        }
    }
}