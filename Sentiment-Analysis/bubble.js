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
        sentiment: "0.7",
        frequency: "9"
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
        frequency: "6"
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
        frequency: "2"
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
];
var sentimentNames = {P: "Positive", N: "Negative", U: "Neutral"};
var colorCodes = {P: "steelblue", N: "#C70039", U: "#E2DF14"};

//default rating
data = words.filter(function (d) {
  return (d.rating == "1");
});
$('.star').addClass('selected');
for (var i = 0; i < 5 - 1; i++) {
  $('.star').eq(i).removeClass('selected');
}

width = 1200,
height = 600;
createSVG();
update_data(data, true);

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
  update_data(data, false);

});

//function to update data based on rating
function update_data(data, firstTime) {
  d3.selectAll("svg > *").remove();
  frequencies = data.map(function(word) { return +word.frequency; });
  frequencyExtent = d3.extent(frequencies);
  sentiment_scores = data.map(function(word) { return +word.sentiment; });
  sentimentExtent = d3.extent(sentiment_scores);
  sentiments = Object.keys(sentimentNames);
  circleSize = { min: 10, max: 80 };
  circleRadiusScale = d3.scaleSqrt()
    .domain(frequencyExtent)
    .range([circleSize.min, circleSize.max]);
  document.getElementById("combine").checked = false;
  document.getElementById("sentiments").checked = false;
  document.getElementById("frequency").checked = false;

  if (!firstTime) {
    forceSimulation.stop();
  }

  toggleSentimentKey(true);
  createCircles();
  createForces();
  createForceSimulation();
  addGroupingListeners();
}

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
    var keyWidth = keyElementWidth * sentiments.length;
    var sentimentKeyScale = d3.scaleBand()
      .domain(sentiments)
      .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

    svg.append("g")
      .attr("class", "sentiment-key")
      .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
      .selectAll("g")
      .data(sentiments)
      .enter()
      .append("g")
      .attr("class", "sentiment-key-element");

    d3.selectAll("g.sentiment-key-element")
      .append("rect")
        .attr("width", keyElementWidth)
        .attr("height", keyElementHeight)
        .attr("x", function(d) { return sentimentKeyScale(d); })
        .attr("fill", function(d) { 
          if (d == "P") {
            return colorCodes["P"] ;
          }
          else if (d == "N") {
            return colorCodes["N"] ;
          }
          else {
            return colorCodes["U"];
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
  // Draw circles and texts for the nodes
  var nodes = svg.append("g")
    .attr("class", "nodes");

  node = nodes.selectAll("node")
    .data(data)
    .enter()
    .append("g");

  var circle = node.append("circle")
    .attr("r", function(d) { return circleRadiusScale(d.frequency); })
    .on("mouseover", function(d) {
      updateWordInfo(d);
    })
    .on("mouseout", function(d) {
      updateWordInfo();
    });

  var text = node.append("text")
    .text(function(d) {
              return d.phrase; })
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", function(d){
        return d.frequency*3; })
    .attr("fill", "black");

  updateCircles();

  function updateWordInfo(word) {
      var info = "";
      if (word) {
        info = `${word.phrase} <br> Frequency: ${formatFrequency(word.frequency)} <br> Sentiment: ${word.sentiment}`;
      }
      d3.select("#word-info").html(info);
  }
}

function updateCircles() {
  node
    .attr("fill", function(d) {
      if (d["sentiment"] > 0.1) {
        return colorCodes["P"] ;
        }
        else if (d["sentiment"] < -0.1) {
            return colorCodes["N"];
        }
        else {
          return colorCodes["U"];
        }
    });
}

function createForces() {
  var forceStrength = 0.08;

  forces = {
    combine:       createCombineForces(),
    sentiment:     createSentimentForces(),
    frequency:     createFrequencyForces()
  };

  function createCombineForces() {
    return {
      x: d3.forceX(width / 2).strength(forceStrength),
      y: d3.forceY(height / 2).strength(forceStrength)
    };
  }

  function createSentimentForces() {
    return {
      x: d3.forceX(sentimentForceX).strength(forceStrength),
      y: d3.forceY(sentimentForceY).strength(forceStrength)
    };

    function sentimentForceX(d) {
      if (d.sentiment < -0.1) {
        return left(width);
      } else if (d.sentiment > 0.1) {
        return right(width);
      }
      else {
        return center(width);
      }
    }

    function sentimentForceY(d) {
      if ((d.sentiment < -0.1) || (d.sentiment > 0.1)) {
        return top(height);
      } else {
        return bottom(height);
      }
    }

    function left(dimension) { return dimension / 4; }
    function center(dimension) { return dimension / 2; }
    function right(dimension) { return dimension / 4 * 3; }
    function top(dimension) { return dimension / 4; }
    function bottom(dimension) { return dimension / 4 * 3; }
  }

  function createFrequencyForces() {
    var scaledFrequencyMargin = circleSize.max;

    frequencyScaleX = d3.scaleLinear()
      .domain(sentimentExtent)
      .range([scaledFrequencyMargin, width - scaledFrequencyMargin*2]);
    frequencyScaleY = d3.scaleLinear()
      .domain(frequencyExtent)
      .range([height - scaledFrequencyMargin, scaledFrequencyMargin*2]);

    return {
      x: d3.forceX(function(d) {
          return frequencyScaleX(d.sentiment);
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

  forceSimulation.nodes(data)
    .on("tick", function() {
    //   circles
    //     .attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    // });
    node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"
      });
    });
}

function forceCollide(d) {
  return frequencyGrouping() ? 0 : circleRadiusScale(d.frequency) + 1;
}

function frequencyGrouping() {
  return isChecked("#frequency");
}

function addGroupingListeners() {
  addListener("#combine",         forces.combine);
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
      .attr("x", height-900)
    } else {
      translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
      translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      xLabel
      .attr("x", width + 570)
      yLabel
      .attr("x", height + 900)
    }

    function createAxes() {
      var numberOfTicksX = (sentimentExtent[1] - sentimentExtent[0])*10,
          numberOfTicksY = frequencyExtent[1]-frequencyExtent[0],
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