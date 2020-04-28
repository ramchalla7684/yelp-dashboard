class CheckinsBarChart {
    constructor() {
        this.margin = {
            top: 10,
            right: 30,
            bottom: 90,
            left: 60
        };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 450 - this.margin.top - this.margin.bottom;

        this.tooltip = d3.select("body").append("div").attr("class", "toolTip");

        this.svg = null;

        this.x = null;
        this.y = null;
        this.opacity = null;

        this.data = null;
        this.yMax = null;
    }


    set currentData(data) {
        this.data = data;
        this.yMax = Math.max(...this.data.map(d => d.checkins)) + 30;
    }

    get currentData() {
        return this.data;
    }

    createSVG() {
        this.svg = d3.select("#bar-chart")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    }


    init() {
        this.x = d3.scaleBand()
            .range([0, this.width])
            .domain(this.currentData.map(function (d) {
                return d.month;
            }))
            .padding(0.3);

        this.y = d3.scaleLinear()
            .domain([0, this.yMax])
            .range([this.height, 0]);

        this.opacity = d3.scaleLinear()
            .domain([0, this.yMax])
            .range([0.2, 1.0]);


        this.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));


        this.svg.append("g")
            .attr("class", "yaxis")
            .call(d3.axisLeft(this.y));

        this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - (this.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Checkins");

        // Bars
        let bars = this.svg.selectAll("bar")
            .data(this.currentData)
            .enter()
            .append("g")
            .attr('transform', d => `translate(${this.x(d.month)}, ${0})`)
            .attr("height", this.height);

        let barWidth = this.x.bandwidth();
        bars.append('rect')
            .attr('x', 0)
            .attr('y', this.height)
            .attr("width", barWidth)
            .attr("fill", "#370C35")
            .attr("height", (d) => {
                return 0;
            })
            .attr("opacity", (d) => {
                return this.opacity(d.checkins)
            })
            .on("mousemove", function () {
                let del = 5;
                d3.select(this)
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(200)
                    .delay(0)
                    .attr('x', -del / 2)
                    .attr('width', barWidth + del);
                // this.tooltip
                //     .style("left", d3.event.pageX + "px")
                //     .style("top", d3.event.pageY - 30 + "px")
                //     .style("display", "inline-block")
                //     .html((d.checkins));
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(200)
                    .delay(0)
                    .attr('x', 0)
                    .attr('width', barWidth);
            });

        bars.append('text')
            .attr('x', barWidth / 2)
            .attr('y', d => this.y(d.checkins) + 10)
            .attr("dy", "1em")
            .attr('font-size', '0.8em')
            .attr("text-anchor", "middle")
            .attr('fill', 'white')
            .text(d => d.checkins);

        // Animation
        this.svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", (d) => {
                return this.y(d.checkins);
            })
            .attr("height", (d) => {
                return this.height - this.y(d.checkins);
            })
            .delay(function (d, i) {
                return (i * 80)
            });
    }

    update() {
        this.y.domain([0, this.yMax]);
        this.svg.selectAll("rect")
            .data(this.currentData)
            .transition()
            .duration(800)
            .attr("y", (d) => {
                return this.y(d.checkins);
            })
            .attr("height", (d) => {
                return this.height - this.y(d.checkins);
            })
            .attr("opacity", (d) => {
                return this.opacity(d.checkins)
            })
            .delay(function (d, i) {
                return (i * 80)
            })

    }
}

data = [{
        "month": "Jan",
        "checkins": 100
    },
    {
        "month": "Feb",
        "checkins": 30
    },
    {
        "month": "March",
        "checkins": 180
    },
    {
        "month": "April",
        "checkins": 200
    },
    {
        "month": "May",
        "checkins": 70
    },
    {
        "month": "Jun",
        "checkins": 60
    },
    {
        "month": "Jul",
        "checkins": 250
    },
    {
        "month": "Aug",
        "checkins": 123
    },
    {
        "month": "Sept",
        "checkins": 180
    },
    {
        "month": "Oct",
        "checkins": 156
    },
    {
        "month": "Nov",
        "checkins": 175
    },
    {
        "month": "Dec",
        "checkins": 232
    }
];

var d2 = [{
        "month": "Jan",
        "checkins": 100
    },
    {
        "month": "Feb",
        "checkins": 30
    },
    {
        "month": "March",
        "checkins": 43
    },
    {
        "month": "April",
        "checkins": 212
    },
    {
        "month": "May",
        "checkins": 122
    },
    {
        "month": "Jun",
        "checkins": 60
    },
    {
        "month": "Jul",
        "checkins": 250
    },
    {
        "month": "Aug",
        "checkins": 32
    },
    {
        "month": "Sept",
        "checkins": 180
    },
    {
        "month": "Oct",
        "checkins": 156
    },
    {
        "month": "Nov",
        "checkins": 175
    },
    {
        "month": "Dec",
        "checkins": 212
    }
];