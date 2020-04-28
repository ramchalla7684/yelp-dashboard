class BarChart {
    constructor() {
        this.margin = {
            top: 10,
            right: 30,
            bottom: 90,
            left: 60
        };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 450 - this.margin.top - this.margin.bottom;

        this.opacity = d3.scaleLinear()
            .domain([0, 300])
            .range([0.2, 1.0]);

        this.tooltip = d3.select("body").append("div").attr("class", "toolTip");

        this.svg = null;

        this.x = null;
        this.y = null;

        this.data = null;
    }


    set currentData(data) {
        this.data = data;
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
            .domain([0, 300])
            .range([this.height, 0]);


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
            .text("Check ins");

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
                return this.opacity(d.checkin)
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
                //     .html((d.checkin));
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
            .attr('y', d => this.y(d.checkin) + 10)
            .attr("dy", "1em")
            .attr('font-size', '0.8em')
            .attr("text-anchor", "middle")
            .attr('fill', 'white')
            .text(d => d.checkin);

        // Animation
        this.svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", (d) => {
                return this.y(d.checkin);
            })
            .attr("height", (d) => {
                return this.height - this.y(d.checkin);
            })
            .delay(function (d, i) {
                return (i * 80)
            });
    }

    update() {

    }
}


let barChart = new BarChart();
barChart.createSVG();

data = [{
        "month": "Jan",
        "checkin": 100
    },
    {
        "month": "Feb",
        "checkin": 30
    },
    {
        "month": "March",
        "checkin": 180
    },
    {
        "month": "April",
        "checkin": 200
    },
    {
        "month": "May",
        "checkin": 70
    },
    {
        "month": "Jun",
        "checkin": 60
    },
    {
        "month": "Jul",
        "checkin": 250
    },
    {
        "month": "Aug",
        "checkin": 123
    },
    {
        "month": "Sept",
        "checkin": 180
    },
    {
        "month": "Oct",
        "checkin": 156
    },
    {
        "month": "Nov",
        "checkin": 175
    },
    {
        "month": "Dec",
        "checkin": 232
    }
];

var d2 = [{
        "month": "Jan",
        "checkin": 100
    },
    {
        "month": "Feb",
        "checkin": 30
    },
    {
        "month": "March",
        "checkin": 43
    },
    {
        "month": "April",
        "checkin": 212
    },
    {
        "month": "May",
        "checkin": 122
    },
    {
        "month": "Jun",
        "checkin": 60
    },
    {
        "month": "Jul",
        "checkin": 250
    },
    {
        "month": "Aug",
        "checkin": 32
    },
    {
        "month": "Sept",
        "checkin": 180
    },
    {
        "month": "Oct",
        "checkin": 156
    },
    {
        "month": "Nov",
        "checkin": 175
    },
    {
        "month": "Dec",
        "checkin": 212
    }
];

barChart.currentData = data;
barChart.init();

function update(data, y) {

    svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(800)
        .attr("y", function (d) {
            return y(d.checkin);
        })
        .attr("height", function (d) {
            return height - y(d.checkin);
        })
        .attr("opacity", function (d) {
            return opacity(d.checkin)
        })
        .delay(function (d, i) {
            return (i * 80)
        })

}