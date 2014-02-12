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
      //.domain(['Homer', 'Marge', 'Bart', 'Lisa', 'Maggie'])
      .rangeRoundBands([0, height], 0.8, 0);

    var barHeight = 15;

    var state = function(d) { 
      return d.State; 
    };

//    var stateButton = 
//      '<label><input type="radio" name="order" value="state">';
//    stateButton += 'State</label>';
//    var rateButton = 
//      '<label><input type="radio" name="order" value="rate" checked>';
//    rateButton += 'Rate</label>';
  


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
      

    d3.tsv("unemp_states_us_nov_2013.tsv", function(data) {

      var max = d3.max(data, function(d) { 
        return d.Rate; 
      });
      var min = 0;

      xScale.domain([min, max]);
      yScale.domain(data.map(state));

      //console.log(yScale('ILLINOIS'));

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
        .attr("height", barHeight);

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
          return barHeight / 2;
        })
        .attr('text-anchor', 'end')
        .text(function(d) {
          return d.State;
        });

     var button = d3.select('button')
       .on('click', function() {
         //console.log(bars.selectAll('g'));
       });

      //console.log(yScale('IOWA'));

      var reorder = function() {
        data.sort(function(a, b) {
          //console.log('compare a.State, b.State: ', a.State, b.State);
          // sort by state
          //if (document.getElementById('state').checked) {
          console.log(yScale('ALABAMA'));
          return d3.ascending(a.State, b.State);
          //} else {
            //return d3.ascending(a.Rate, b.Rate);
          //}
        });

        // update yScale domain after sorting
        yScale.domain(data.map(state));
        

        bars
          .transition()
            .duration(5750)
            .delay(function(d, i) {
              //console.log(d);
              return i * 10;
            })
            .attr('transform', function(d, i) {
              //console.log(d.State);
              //console.log(i);
              console.log(i);
              console.log(this);
              console.log(d.State);
              return 'translate(0, ' + yScale(d.State)  + ')';
            });
      }

      d3.selectAll('input')
        .on('change', reorder);

    });

})();
