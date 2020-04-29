class CheckinsBarChart {
    constructor() {
        this.margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 60
        };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 450 - this.margin.top - this.margin.bottom;

        this.svg = null;
        this.bars = null;

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
        this.bars = this.svg.selectAll(".bar")
            .data(this.currentData)
            .enter()
            .append("g")
            .attr('class', 'bar')
            .attr('transform', d => `translate(${this.x(d.month)}, ${0})`)
            .attr("height", this.height);

        let barWidth = this.x.bandwidth();
        this.bars.append('rect')
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
            })
            .on('end', () => {
                this.bars.append('text')
                    .attr('class', 'bar-text')
                    .attr('x', barWidth / 2)
                    .attr('y', (d, i, nodes) => this.y(this.currentData[i].checkins) - 20)
                    .attr("dy", "1em")
                    .attr('font-size', '0.8em')
                    .attr("text-anchor", "middle")
                    .attr('fill', 'black')
                    .text((d, i, nodes) => this.currentData[i].checkins);
            });
    }

    update() {
        this.y = this.y.domain([0, this.yMax]);
        this.opacity = this.opacity.domain([0, this.yMax]);

        this.svg.selectAll('.bar-text').remove();

        this.svg.select(".yaxis")
            .call(d3.axisLeft(this.y));


        let barWidth = this.x.bandwidth();
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
            .on('end', () => {
                this.bars.append('text')
                    .attr('class', 'bar-text')
                    .attr('x', barWidth / 2)
                    .attr('y', (d, i, nodes) => this.y(this.currentData[i].checkins) - 20)
                    .attr("dy", "1em")
                    .attr('font-size', '0.8em')
                    .attr("text-anchor", "middle")
                    .attr('fill', 'black')
                    .text((d, i, nodes) => this.currentData[i].checkins);
            });
    }
}