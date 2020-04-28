class LineChart {
    constructor() {
        this.margin = {
            top: 30,
            right: 120,
            bottom: 30,
            left: 50
        };

        this.width = 860 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.tooltip = {
            width: 100,
            height: 100,
            x: 10,
            y: -30
        };

        this.parseDate = d3.timeParse("%m/%e/%Y");
        this.bisectDate = d3.bisector(function (d) {
            return d.month;
        }).left;

        this.formatValue = d3.format(",");
        this.dateFormatter = d3.timeFormat("%m/%d/%y");

        this.x = null;
        this.y = null;

        this.line = null;

        this.svg = null;

        this.data = null;

        this.focus = null;
    }

    set currentData(data) {
        this.data = data;
    }

    get currentData() {
        return this.data;
    }

    createSVG() {
        this.svg = d3.select("#line-chart").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    }

    init() {

        this.x = d3.scaleOrdinal()
            .range([...Array.from(Array(12).keys()).map(i => i * this.width / 11)]);
        this.y = d3.scaleLinear()
            .range([this.height, 0]);


        this.x = this.x.domain([...MONTHS]);
        this.y = this.y.domain([1, 5]);

        console.log(this.x("Feb"));
        console.log(this.x("Jan"));
        console.log(this.x("Apr"));

        this.line = d3.line()
            .x((d) => {
                // console.log(this.x(d.month));
                return this.x(d.month);
            })
            .y((d) => {
                return this.y(d.stars);
            });

        this.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));


        this.svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(this.y));


        let path = this.svg.append("path")
            .datum(this.currentData)
            .attr("class", "line")
            .attr("d", this.line);

        let pathLength = path.node().getTotalLength();

        let transitionPath = d3
            .transition()
            .ease(d3.easeSin)
            .delay(0)
            .duration(1500);
        path
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath).on("end", () => {

                this.svg.selectAll(".dot")
                    .data(this.currentData)
                    .enter().append("circle") // Uses the enter().append() method
                    .attr("class", "dot")
                    .attr("cx", (d, i) => {
                        // console.log(this.x(d.month));
                        return this.x(d.month)
                    })
                    .attr("cy", (d) => {
                        console.log(this.y(d.stars));
                        return this.y(d.stars)
                    })
                    .attr("r", 5);
            })
            .attr("stroke-dashoffset", 0);

        this.focus = this.svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        this.focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        this.focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", -2);

        this.focus.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .text("Stars:");

        this.focus.append("text")
            .attr("class", "tooltip-stars")
            .attr("x", 60)
            .attr("y", 18);

        let mousemove = this.mousemove;
        let self = this;
        this.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", this.width)
            .attr("height", this.height)
            .on("mouseover", () => {
                this.focus.style("display", null);
            })
            .on("mouseout", () => {
                this.focus.style("display", "none");
            })
            .on("mousemove", function () {
                mousemove(this, self);
            });

    }

    update() {
        // this.x = this.x.domain([this.currentData[0].date, this.currentData[this.currentData.length - 1].date]);
        // this.y = this.y.domain([1, 5]);
        this.svg.select(".x-axis").remove();

        this.svg.select(".y-axis").remove();
        this.svg.selectAll(".dot").remove();

        this.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));


        this.svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(this.y));


        var path = this.svg.select("path")
            .datum(this.currentData)
            .attr("class", "line")
            .attr("d", this.line);

        const pathLength = path.node().getTotalLength();
        const transitionPath = d3
            .transition()
            .ease(d3.easeSin)
            .duration(2500);
        path
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath).on("end", () => {
                this.svg.selectAll(".dot")
                    .data(this.currentData)
                    .enter().append("circle") // Uses the enter().append() method
                    .attr("class", "dot")
                    .attr("cx", (d, i) => {
                        return this.x(d.month)
                    })
                    .attr("cy", (d) => {
                        return this.y(d.stars)
                    })
                    .attr("r", 5);
            })
            .attr("stroke-dashoffset", 0);

    }

    mousemove(ref, self) {
        var x0 = self.x.invert(d3.mouse(ref)[0]),
            i = self.bisectDate(self.currentData, x0, 1),
            d0 = self.currentData[i - 1],
            d1 = self.currentData[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        self.focus.attr("transform", "translate(" + self.x(d.month) + "," + self.y(d.stars) + ")");
        self.focus.select(".tooltip-date").text(self.dateFormatter(d.month));
        self.focus.select(".tooltip-stars").text(self.formatValue(d.stars));
    }


}

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


// let lineChart = new LineChart();
// lineChart.createSVG();

// currentData = JSON.parse(JSON.stringify(all_data[0].data));
// currentData.forEach(function (d) {
//     d.month = lineChart.parseDate(d.month);
//     // console.log(d.month);
//     d.likes = +d.likes;
// });

// lineChart.currentData = currentData;
// lineChart.init();


// currentData.forEach(function (d) {
//     // console.log("date: " + d.month)
//     // console.log("likes: " + d.likes + " : " + typeof d.likes)
//     d.month = lineChart.parseDate(d.month);
//     d.likes = +d.likes;
// });

// lineChart.currentData = currentData;
// lineChart.update();



// D3 provides lots of transition options, have a play around here:
// https://github.com/d3/d3-transition