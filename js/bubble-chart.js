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
            bottom: 60,
            left: 60
        };
        this.width = 1200 - this.margin.left - this.margin.right;
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
        this.svg.selectAll('*').remove();
        let frequencies = data.map(function (word) {
            return +word.frequency;
        });
        let frequencyExtent = d3.extent(frequencies);
        let sentiment_scores = data.map(function (word) {
            return +word.sentiment;
        });

        let sentimentExtent = d3.extent(sentiment_scores);
        let sentiments = Object.keys(sentimentNames);

        this.circleRadiusScale = d3.scaleLog()
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

        document.getElementById("frequency").click();
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
            .attr("class", "nodes")

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
            .text((d) => {
                if (this.circleRadiusScale(d.frequency) / 0.9 < 8) {
                    return "";
                }
                return d.keyword;
            })
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", (d) => {
                // if (d.frequency * 2.5 < 8) {
                //     return Math.max(this.circleRadiusScale(d.frequency), 8);
                // }
                return Math.min(this.circleRadiusScale(d.frequency) / 0.9, 13);
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

                // var xAxis = d3.axisBottom(this.frequencyScaleX)
                //     .ticks(numberOfTicks, tickFormatX);

                // this.svg.append("g")
                //     .attr("class", "x-axis")
                //     .attr("transform", "translate(0," + (this.height + offScreenYOffset) + ")")
                //     .call(xAxis);


                this.svg.selectAll('.g-x-axis').remove();

                let xAxis = this.svg.append('g')
                    .attr('class', 'g-x-axis');

                xAxis.append('text')
                    .attr('text-anchor', 'middle')
                    .style('alignment-baseline', 'middle')
                    .attr('class', 'x-label')
                    .attr('x', this.width / 2)
                    .attr('y', this.height - 30)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Sentiment score");


                let xAxisLine = xAxis.append('line')
                    .attr('transform', `translate(${50}, ${this.height-30})`)
                    .attr('x1', 0)
                    .attr('y1', 0)
                    .attr('x2', this.width - 2 * 40)
                    .attr('y2', 0)
                    .attr('stroke', '#757575')
                    .attr('stroke-width', 0.8)
                    .attr('marker-end', 'url(#arrow-head-r)');


                xAxis.append("svg:defs").append("svg:marker")
                    .attr("id", "arrow-head-r")
                    .attr("refX", 6)
                    .attr("refY", 6)
                    .attr("markerWidth", 30)
                    .attr("markerHeight", 30)
                    .append("path")
                    .attr("d", "M 0 0 12 6 0 12 3 6")
                    .style("fill", "#757575");



                this.svg.selectAll('.g-y-axis').remove();

                let yAxis = this.svg.append('g')
                    .attr('class', 'g-y-axis');

                yAxis.append("text")
                    .attr('class', 'y-label')
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - 2)
                    .attr("x", 0 - (this.height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style('alignment-baseline', 'middle')
                    .text("Frequency");


                let yAxisLine = xAxis.append('line')
                    .attr('transform', `translate(${30}, ${30})`)
                    .attr('x1', 0)
                    .attr('y1', 0)
                    .attr('x2', 0)
                    .attr('y2', this.height - 2 * 40)
                    .attr('stroke', '#757575')
                    .attr('stroke-width', 0.8)
                    .attr('marker-start', 'url(#arrow-head-u)');

                yAxis.append("svg:defs").append("svg:marker")
                    .attr("id", "arrow-head-u")
                    .attr("refX", 6)
                    .attr("refY", 6)
                    .attr("markerWidth", 30)
                    .attr("markerHeight", 30)
                    .append("path")
                    // .attr("d", "M 0 0 12 6 0 12 3 6")
                    .attr("d", "M 0 12 6 0 12 12 6 9")
                    .style("fill", "#757575");
            };


            if (this.svg.select(".x-axis").empty()) {
                createAxes();
            }
            var xAxis = this.svg.select(".g-x-axis"),
                yAxis = this.svg.select(".g-y-axis");

            if (showAxes) {

                xAxis.classed('invisible', false);
                yAxis.classed('invisible', false);
            } else {
                xAxis.classed('invisible', true);
                yAxis.classed('invisible', true);
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