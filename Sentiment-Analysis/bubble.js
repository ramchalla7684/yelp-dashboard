//dummy data
var words = [{rating: "1", phrase: "mac cheese", sentiment: "0.8", sentimentCode: "P", frequency: "10"},
            {rating: "1", phrase: "gabi good", sentiment: "0.5", sentimentCode: "P", frequency: "5"},
            {rating: "1", phrase: "steak knife", sentiment: "0.1", sentimentCode: "P", frequency: "3"},
            {rating: "1", phrase: "service", sentiment: "-0.8", sentimentCode: "N", frequency: "1"},
            {rating: "2", phrase: "washroom", sentiment: "0.7", sentimentCode: "P", frequency: "10"},
            {rating: "2", phrase: "dirty", sentiment: "-0.5", sentimentCode: "N", frequency: "5"},
            {rating: "2", phrase: "clean", sentiment: "0.1", sentimentCode: "P", frequency: "3"},
            {rating: "2", phrase: "tasty", sentiment: "0.8", sentimentCode: "P", frequency: "1"},
            {rating: "3", phrase: "mushroom", sentiment: "-0.7", sentimentCode: "N", frequency: "10"},
            {rating: "3", phrase: "not good", sentiment: "-0.5", sentimentCode: "N", frequency: "5"},
            {rating: "3", phrase: "DBC", sentiment: "0.1", sentimentCode: "P", frequency: "3"},
            {rating: "3", phrase: "yummy", sentiment: "0.8", sentimentCode: "P", frequency: "1"},
            {rating: "4", phrase: "best steak", sentiment: "0.7", sentimentCode: "P", frequency: "10"},
            {rating: "4", phrase: "great view", sentiment: "0.5", sentimentCode: "P", frequency: "5"},
            {rating: "4", phrase: "creme brule", sentiment: "0.1", sentimentCode: "P", frequency: "3"},
            {rating: "4", phrase: "waiter", sentiment: "-0.2", sentimentCode: "N", frequency: "1"},
            {rating: "5", phrase: "wine list", sentiment: "0.9", sentimentCode: "P", frequency: "10"},
            {rating: "5", phrase: "dinner", sentiment: "0.5", sentimentCode: "P", frequency: "5"},
            {rating: "5", phrase: "food", sentiment: "0.1", sentimentCode: "P", frequency: "3"},
            {rating: "5", phrase: "fondue", sentiment: "0.8", sentimentCode: "P", frequency: "1"}]
var sentimentNames = {P: "Positive", N: "Negative"};
var frequencies = words.map(function(word) { return +word.frequency; });
var meanFrequency = d3.mean(frequencies),
    frequencyExtent = d3.extent(frequencies),
    frequencyScaleX,
    frequencyScaleY;

var sentiments = d3.set(words.map(function(word) { return word.sentimentCode; }));

var width = 1200,
    height = 700;
var svg,
    circles,
    circleSize = { min: 10, max: 80 };
var circleRadiusScale = d3.scaleSqrt()
  .domain(frequencyExtent)
  .range([circleSize.min, circleSize.max]);

var forces,
    forceSimulation;

createSVG();
toggleSentimentKey(!false);
createCircles();
createForces();
createForceSimulation();
addGroupingListeners();

function createSVG() {
  svg = d3.select("#bubble-chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height);
}

function toggleSentimentKey(showSentimentKey) {
  var keyElementWidth = 150,
      keyElementHeight = 30;
  var onScreenYOffset = keyElementHeight*1.5,
      offScreenYOffset = 100;

  if (d3.select(".sentiment-key").empty()) {
    createSentimentKey();
  }
  var sentimentKey = d3.select(".sentiment-key");

  if (showSentimentKey) {
    translateSentimentKey("translate(0," + (height - onScreenYOffset) + ")");
  } else {
    translateSentimentKey("translate(0," + (height + offScreenYOffset) + ")");
  }

  function createSentimentKey() {
    var keyWidth = keyElementWidth * sentiments.values().length;
    var sentimentKeyScale = d3.scaleBand()
      .domain(sentiments.values())
      .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

    svg.append("g")
      .attr("class", "sentiment-key")
      .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
      .selectAll("g")
      .data(sentiments.values())
      .enter()
        .append("g")
          .attr("class", "sentiment-key-element");

    d3.selectAll("g.sentiment-key-element")
      .append("rect")
        .attr("width", keyElementWidth)
        .attr("height", keyElementHeight)
        .attr("x", function(d) { return sentimentKeyScale(d); })
        .attr("fill", function(d) { 
          console.log(d)
          if (d == "N") {
            return "#C70039" ;
          }
          else {
              return "steelblue";
          } });

    d3.selectAll("g.sentiment-key-element")
      .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return sentimentKeyScale(d) + keyElementWidth/2; })
        .text(function(d) { return sentimentNames[d]; });

    // The text BBox has non-zero values only after rendering
    d3.selectAll("g.sentiment-key-element text")
        .attr("y", function(d) {
          var textHeight = this.getBBox().height;
          // The BBox.height property includes some extra height we need to remove
          var unneededTextHeight = 4;
          return ((keyElementHeight + textHeight) / 2) - unneededTextHeight;
        });
  }

  function translateSentimentKey(translation) {
    sentimentKey
      .transition()
      .duration(500)
      .attr("transform", translation);
  }
}

function isChecked(elementID) {
  return d3.select(elementID).property("checked");
}

function createCircles() {
  var formatFrequency = d3.format(",");
  circles = svg.selectAll("circle")
    .data(words)
    .enter()
      .append("circle")
      .attr("r", function(d) { return circleRadiusScale(d.frequency); })
      .on("mouseover", function(d) {
        updateWordInfo(d);
      })
      .on("mouseout", function(d) {
        updateWordInfo();
      });
  updateCircles();

  function updateWordInfo(word) {
    var info = "";
    if (word) {
      // info = [word.phrase, formatFrequency(word.frequency)].join(": ");
      info = `${word.phrase} <br> Frequency: ${formatFrequency(word.frequency)} <br> Sentiment: ${word.sentiment}`;
    }
    d3.select("#word-info").html(info);
  }
}

function updateCircles() {
  circles
    .attr("fill", function(d) {
      if (d["sentiment"] < 0) {
        return "#C70039" ;
        }
        else {
            return "steelblue";
        }
    });
}

function createForces() {
  var forceStrength = 0.05;

  forces = {
    combine:        createCombineForces(),
    // wordCenters: createWordCenterForces(),
    sentiment:      createSentimentForces(),
    frequency:     createFrequencyForces()
  };

  function createCombineForces() {
    return {
      x: d3.forceX(width / 2).strength(forceStrength),
      y: d3.forceY(height / 2).strength(forceStrength)
    };
  }

  // function createWordCenterForces() {
  //   var projectionStretchY = 0.25,
  //       projectionMargin = circleSize.max,
  //       projection = d3.geoEquirectangular()
  //         .scale((width / 2 - projectionMargin) / Math.PI)
  //         .translate([width / 2, height * (1 - projectionStretchY) / 2]);

  //   return {
  //     x: d3.forceX(function(d) {
  //         return projection([d.CenterLongitude, d.CenterLatitude])[0];
  //       }).strength(forceStrength),
  //     y: d3.forceY(function(d) {
  //         return projection([d.CenterLongitude, d.CenterLatitude])[1] * (1 + projectionStretchY);
  //       }).strength(forceStrength)
  //   };
  // }

  function createSentimentForces() {
    return {
      x: d3.forceX(sentimentForceX).strength(forceStrength),
      y: d3.forceY(sentimentForceY).strength(forceStrength)
    };

    function sentimentForceX(d) {
      if (d.sentimentCode === "N") {
        return left(width);
      } else if (d.sentimentCode === "P") {
        return right(width);
      }
      return center(width);
    }

    function sentimentForceY(d) {
      if (d.sentimentCode === "P") {
        return top(height);
      } else if (d.sentimentCode === "N") {
        return bottom(height);
      }
      return center(height);
    }

    function left(dimension) { return dimension / 4; }
    function center(dimension) { return dimension / 2; }
    function right(dimension) { return dimension / 4 * 3; }
    function top(dimension) { return dimension / 4; }
    function bottom(dimension) { return dimension / 4 * 3; }
  }

  function createFrequencyForces() {
    var sentimentNamesDomain = sentiments.values().map(function(sentimentCode) {
      return sentimentNames[sentimentCode];
    });
    var scaledFrequencyMargin = circleSize.max;

    frequencyScaleX = d3.scaleBand()
      .domain(sentimentNamesDomain)
      .range([scaledFrequencyMargin, width - scaledFrequencyMargin*2]);
    frequencyScaleY = d3.scaleLog()
      .domain(frequencyExtent)
      .range([height - scaledFrequencyMargin, scaledFrequencyMargin*2]);

    var centerCirclesInScaleBandOffset = frequencyScaleX.bandwidth() / 2;
    return {
      x: d3.forceX(function(d) {
          return frequencyScaleX(sentimentNames[d.sentimentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
      y: d3.forceY(function(d) {
        return frequencyScaleY(d.frequency);
      }).strength(forceStrength)
    };
  }

}

function createForceSimulation() {
  forceSimulation = d3.forceSimulation()
    .force("x", forces.combine.x)
    .force("y", forces.combine.y)
    .force("collide", d3.forceCollide(forceCollide));
  forceSimulation.nodes(words)
    .on("tick", function() {
      circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });
}

function forceCollide(d) {
  // return wordCenterGrouping() || frequencyGrouping() ? 0 : circleRadiusScale(d.frequency) + 1;
  return frequencyGrouping() ? 0 : circleRadiusScale(d.frequency) + 1;
}

// function wordCenterGrouping() {
//   return isChecked("#word-centers");
// }

function frequencyGrouping() {
  return isChecked("#frequency");
}

function addGroupingListeners() {
  addListener("#combine",         forces.combine);
  // addListener("#word-centers", forces.wordCenters);
  addListener("#sentiments",      forces.sentiment);
  addListener("#frequency",      forces.frequency);

  function addListener(selector, forces) {
    d3.select(selector).on("click", function() {
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
    var onScreenXOffset = 40,
        offScreenXOffset = -40;
    var onScreenYOffset = 40,
        offScreenYOffset = 100;

    if (d3.select(".x-axis").empty()) {
      createAxes();
    }
    var xAxis = d3.select(".x-axis"),
        yAxis = d3.select(".y-axis");

    if (showAxes) {
      translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
      translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
    } else {
      translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
      translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
    }

    function createAxes() {
      var numberOfTicks = 10,
          tickFormat = ".0s";

      var xAxis = d3.axisBottom(frequencyScaleX)
        .ticks(numberOfTicks, tickFormat);

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
        .call(xAxis)
        .selectAll(".tick text")
          .attr("font-size", "16px");

      var yAxis = d3.axisLeft(frequencyScaleY)
        .ticks(numberOfTicks, tickFormat);
      svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + offScreenXOffset + ",0)")
        .call(yAxis);
    }

    function translateAxis(axis, translation) {
      axis
        .transition()
        .duration(500)
        .attr("transform", translation);
    }
  }
}