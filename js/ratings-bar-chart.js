class RatingsBarChart {
    constructor() {
        this.margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 50
        };
        this.width = 460 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;

        this.tooltip = d3.select("body").append("div").attr("class", "toolTip");

        this.svg = null;
        this.bars = null;

        this.x = null;
        this.y = null;
        this.opacity = null;

        this.data = null;
        this.yMax = null;

        this.selectedBar = null;
    }


    set currentData(data) {
        this.data = data;
        this.yMax = Math.max(...this.data.map(d => d.num)) + 5;
    }

    get currentData() {
        return this.data;
    }

    createSVG() {
        this.svg = d3.select("#ratings-bar-chart")
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
                return d.stars;
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
            .text("Number of ratings");

        this.bars = this.svg.selectAll(".bar")
            .data(this.currentData)
            .enter()
            .append("g")
            .attr('class', 'bar')
            .attr('transform', d => `translate(${this.x(d.stars)}, ${0})`)
            .attr("height", this.height)
            .on('click', (d, i, nodes) => {
                d = this.currentData[i];
                if (this.selectedBar) {
                    this.selectedBar.classed('selected', false).remove();
                }

                let padding = 4;
                var data = [
                    [-padding, this.height],
                    [-padding, this.y(d.num) - padding],
                    [barWidth + padding, this.y(d.num) - padding],
                    [barWidth + padding, this.height]
                ];

                var lineGenerator = d3.line();
                var pathString = lineGenerator(data);
                this.selectedBar = d3.select(nodes[i]).classed('selected', true)
                    .append('path')
                    .attr('d', pathString)
                    .attr('fill', 'none')
                    .attr("opacity", this.opacity(d.num));
                this.onBarSelected(d.stars);
            });

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
                return this.opacity(d.num)
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
                //     .html((d.num));
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
                return this.y(d.num);
            })
            .attr("height", (d) => {
                return this.height - this.y(d.num);
            })
            .delay(function (d, i) {
                return (i * 80)
            }).on('end', () => {
                this.bars.append('text')
                    // .enter(this.currentData)
                    .attr('x', barWidth / 2)
                    .attr('y', d => this.y(d.num) - 20)
                    .attr("dy", "1em")
                    .attr('font-size', '0.8em')
                    .attr("text-anchor", "middle")
                    .attr('fill', 'black')
                    .text(d => d.num);
            });
    }

    update() {
        if (this.selectedBar) {
            this.selectedBar.classed('selected', false).remove();
        }

        this.y = this.y.domain([0, this.yMax]);
        this.opacity = this.opacity.domain([0, this.yMax]);

        this.bars.select('text').remove();

        let barWidth = this.x.bandwidth();
        this.bars.select("rect")
            .data(this.currentData)
            .transition()
            .duration(800)
            .attr("y", (d) => {
                return this.y(d.num);
            })
            .attr("height", (d) => {
                return this.height - this.y(d.num);
            })
            .attr("opacity", (d) => {
                return this.opacity(d.num)
            })
            .delay(function (d, i) {
                return (i * 80)
            })
            .on('end', () => {
                this.bars.append('text')
                    .enter(this.currentData)
                    .attr('x', barWidth / 2)
                    .attr('y', d => this.y(d.num) - 20)
                    .attr("dy", "1em")
                    .attr('font-size', '0.8em')
                    .attr("text-anchor", "middle")
                    .attr('fill', 'black')
                    .text(d => d.num);
            });
        // this.bars.select('text')
        //     .data(this.currentData)
        //     .attr('x', barWidth / 2)
        //     .attr('y', d => this.y(d.num) - 10)
        //     .attr("dy", "1em")
        //     .attr('font-size', '0.8em')
        //     .attr("text-anchor", "middle")
        //     .attr('fill', 'white')
        //     .text(d => d.num);
    }

    onBarSelected(stars) {
        console.log(stars);
    }
}