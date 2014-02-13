(function() {

    var margin = 
    {
      top: 50, 
      bottom: 10, 
      left:300, 
      right: 40
    };

    var width = 900 - margin.left - margin.right;
    var height = 900 - margin.top - margin.bottom;

    var xScale = d3.scale.linear()
      .range([0, width]);
    var yScale = d3.scale.ordinal()
      .rangeRoundBands([0, height], 0.8, 0);

    var barHeight = 15;

    var state = function(d) { 
      return d.State; 
    };

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
      .attr("transform", "translate(" 
        + margin.left + "," + margin.top + ")");

    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', 18)
      .style('font-weight', 'bold')
      .text('Unemployment Rates for States');

    // load the tsv
    d3.tsv("unemp_states_us_nov_2013.tsv", function(data) {

      var max = d3.max(data, function(d) { 
        return d.Rate; 
      });
      var min = 0;

      xScale.domain([min, max]);
      yScale.domain(data.map(state));
      
      var colorScale = d3.scale.linear()
        .domain([min, max])
        .interpolate(d3.interpolateRgb)
        .range(['orangered', 'silver']);

      var groups = g.append("g")
        .selectAll("g")
        .data(data)
      .enter()
        .append("g")
        .attr("transform", function(d, i) { 
          return "translate(0, " + yScale(d.State) +")"; 
        });

      var bars = groups
        .append("rect")
        .attr("width", function(d) { 
          return xScale(d.Rate); 
        })
        .attr("height", barHeight)
        .attr('fill', function(d, i) {
          return colorScale(d.Rate);
        });


      // add rates to bars
      groups.append('text')
        .attr('x', function (d) {
          //return xScale(d.Rate);
          return xScale(d.Rate);
        })
        .attr('dx', -5)
        .attr('y', function (d) {
          return (barHeight / 2);
        })
        .attr('dy', 3)
        .attr('fill', '#ffffff')
        .attr('text-anchor', 'end')
        .text(function(d) {
          return d.Rate;
        });

      // add state names to bars
      groups.append('text')
        .attr('x', 0)
        .attr('dx', -10)
        .attr('y', function() {
          return (barHeight / 2) + 2;
        })
        .attr('text-anchor', 'end')
        .text(function(d) {
          return d.State;
        });

     var button = d3.select('button')
       .on('click', function() {
         //console.log(bars.selectAll('g'));
       });

      var curOrder; // sort order of bars

      var reorder = function() {

        // determine which button is checked
        var sortItem = (document.getElementById('state').checked) ?
          'state' : 'rate';

        // determine how to sort based on whether the 
        // input's class is set to asc or desc
        curOrder = d3.select("input[value='" + sortItem + "']")
          .attr('class');

        data.sort(function(a, b) {
          // sort by state
          if (sortItem == 'state') {
            if (curOrder == 'asc') {
              return d3.ascending(a.State, b.State);
            } else  {
              return d3.descending(a.State, b.State);
            }
          } else { // sort by rate
            if (curOrder == 'asc') {
              if (d3.ascending(a.Rate, b.Rate) == 0) { // we have a tie
                return d3.ascending(a.State, b.State); // so sort alpha
              } else {
                return d3.ascending(a.Rate, b.Rate);
              }
            } else {
              if (d3.descending(a.Rate, b.Rate) == 0) {
                return d3.descending(a.State, b.State);
              } else {
                return d3.descending(a.Rate, b.Rate);
              }
            }
          }

        }); // end sort()

        // update yScale domain after sorting
        yScale.domain(data.map(state));
        
        groups
          .transition()
            .duration(750)
            .delay(function(d, i) {
              return i * 10;
            })
            .attr('transform', function(d, i) {
              return 'translate(0, ' + yScale(d.State)  + ')';
            });
      }; // end reorder()

      // set both inputs to 'asc'
      d3.selectAll('input')
        .attr('class', 'asc');

      // when user hits a radio button, reorder the bars
      d3.selectAll('input')
        .on('change', reorder);

      // sort again on clicking the same radio button
      d3.selectAll('input')
        .on('click', function() {
          reorder();        
      
          // toggle asc/desc on button
          var btn = d3.select(this);
          curOrder = btn.attr('class');
          btn.attr('class', function() {
            return curOrder == 'asc' ? 'desc' : 'asc'
          });

        });


    }); // end d3.tsv()

})();
