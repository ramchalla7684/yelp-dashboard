class LineChart {
    constructor(year) {

        this.year = year;

        this.margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        };

        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;
        this.tooltip = {
            width: 100,
            height: 100,
            x: 10,
            y: -30
        };

        this.x = null;
        this.y = null;

        this.line = null;

        this.svg = null;

        this.data = null;

        this.selectedDot = null;
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
        this.y = this.y.domain([0, 5]);

        this.line = d3.line()
            .x((d) => {
                // console.log(this.x(d.month));
                return this.x(d.month);
            })
            .y((d) => {
                return this.y(d.stars);
            });

        this.svg.append("g")
            .attr("class", "line-chart-x-axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));


        this.svg.append("g")
            .attr("class", "line-chart-y-axis")
            .call(d3.axisLeft(this.y));


        let path = this.svg.append("path")
            .datum(this.currentData)
            .attr("class", "line")
            .attr("d", this.line);

        let pathLength = path.node().getTotalLength();

        let transitionPath = d3
            .transition()
            .ease(d3.easeLinear)
            .delay(90)
            .duration(1000);
        path
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath).on("end", () => {

                let self = this;
                this.svg.selectAll(".dot")
                    .data(this.currentData)
                    .enter().append("circle")
                    .attr('class', (d, i) => `dot dot-${i}`)
                    .attr("cx", (d, i) => {
                        return this.x(d.month)
                    })
                    .attr("cy", (d) => {
                        return this.y(d.stars)
                    })
                    .attr("r", 4)
                    .on('click', function (d) {
                        if (self.selectedDot) {
                            self.selectedDot.attr('r', 4).classed('selected', false);
                        }
                        self.selectedDot = d3.select(this).attr('r', 8).classed('selected', true);
                        self.onDotSelected(d.month);
                    });
            })
            .attr("stroke-dashoffset", 0);

        let self = this;
        let findClosestRange = (x, range) => {
            for (let i = 0; i < range.length; i++) {
                if (Math.abs(x - range[i]) < 30) {
                    return i;
                }
            }
            return -1;
        }

        this.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", this.width)
            .attr("height", this.height)
            .on("mouseover", () => {
                this.svg.select('.highlight-path').remove();
            })
            .on("mouseout", () => {
                this.svg.select('.highlight-path').remove();
            })
            .on("mousemove", (d, i, nodes) => {

                this.svg.select('.highlight-path').remove();

                let mouseX = d3.mouse(nodes[i])[0];
                let idx = findClosestRange(mouseX, this.x.range());
                if (idx == -1) {
                    return;
                }

                let x = this.x(this.currentData[idx].month);
                let y = this.y(this.currentData[idx].stars);
                // console.log(x, y);

                var data = [
                    [0, y],
                    [x, y],
                    [x, this.height]
                ];
                var lineGenerator = d3.line();
                var pathString = lineGenerator(data);
                this.svg
                    .append('path')
                    .attr('class', 'highlight-path')
                    .attr('d', pathString)
                    .attr('fill', 'none');
            })
            .on('click', (d, i, nodes) => {
                // console.log("CLICKED");

                let mouseX = d3.mouse(nodes[i])[0];
                let idx = findClosestRange(mouseX, this.x.range());
                if (idx == -1) {
                    return;
                }

                let x = this.x(this.currentData[idx].month);
                let y = this.y(this.currentData[idx].stars);
                // console.log(x, y);

                if (this.selectedDot) {
                    this.selectedDot.attr('r', 4).classed('selected', false);
                }

                // console.log(this.svg.select(`circle.dot-${idx}`));
                this.selectedDot = this.svg.select(`circle.dot-${idx}`).attr('r', 8).classed('selected', true);
                this.onDotSelected(this.currentData[idx].month);
            });

    }

    update() {
        // this.x = this.x.domain([this.currentData[0].date, this.currentData[this.currentData.length - 1].date]);
        // this.y = this.y.domain([1, 5]);
        this.svg.select(".line-chart-x-axis").remove();
        this.svg.select(".line-chart-y-axis").remove();
        this.svg.selectAll(".dot").remove();
        this.selectedDot = null;

        this.svg.append("g")
            .attr("class", "line-chart-x-axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));

        this.svg.append("g")
            .attr("class", "line-chart-y-axis")
            .call(d3.axisLeft(this.y));

        var path = this.svg.select("path")
            .datum(this.currentData)
            .attr("class", "line")
            .attr("d", this.line);

        const pathLength = path.node().getTotalLength();
        const transitionPath = d3
            .transition()
            .ease(d3.easeLinear)
            .delay(90)
            .duration(1000);
        path
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath).on("end", () => {
                let self = this;
                this.svg.selectAll(".dot")
                    .data(this.currentData)
                    .enter().append("circle")
                    .attr("class", (d, i) => `dot dot-${i}`)
                    .attr("cx", (d, i) => {
                        return this.x(d.month)
                    })
                    .attr("cy", (d) => {
                        return this.y(d.stars)
                    })
                    .attr("r", 4)
                    .on('click', function (d) {
                        if (self.selectedDot) {
                            self.selectedDot.attr('r', 4).classed('selected', false);
                        }
                        self.selectedDot = d3.select(this).attr('r', 8).classed('selected', true);
                        self.onDotSelected(d.month);
                    });
            })
            .attr("stroke-dashoffset", 0);

    }

    onDotSelected(month) {
        showRatingsBarChart(this.year, MONTHS.indexOf(month));
        showBubbleChart(this.year, MONTHS.indexOf(month));
    }
}