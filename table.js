(function() {

  console.log('table table table');

  d3.text(
    'unemp_states_us_nov_2013.tsv', 
    'text/plain', 
    function(data) {
      var title = 'Unemployment Rates for States<br>';
      title += 'Monthly Rankings<br>';
      title += 'Seasonally Adjusted<br>';
      title += 'Nov. 2013';

      d3.select('body').append('h1')
        .text('Unemployment Rates for States');
      var parsed = d3.tsv.parseRows(data);
      var table = d3.select('body').append('table');
      var caption = d3.select('table').append('caption')
      
      var thead = table.append('thead').append('tr');
      var tbody = table.append('tbody');

      d3.select('caption')
        .html(title);

      console.log(title);
 
      thead.selectAll('th')
        .data(parsed[0])
        .enter().append('th')
          .text(function(d) {
            return d;
          });

      parsed.shift(); // remove header row

      var rows = tbody.selectAll('tr')
        .data(parsed)
        .enter().append('tr')
          .style('background-color', function(d, i) {
            if (i % 2 == 0) {
              return '#d0d0d0';
            } else {
              return '#ffffff';
            }
          });

      var cells = rows.selectAll('td')
        .data(function(row, i) {
          return d3.range(Object.keys(row).length)
            .map(function(column, i) {
              return row[Object.keys(row)[i]];             
            });
        })
        .enter().append('td')
          .text(function(d) {
            return d;
          });

      var selectedRowColor;

      var highlightRow = function(row) {
        row.style('background-color', 'yellow');
      }

      var unHighlightRow = function(row) {
        row.style('background-color', selectedRowColor);
        selectedRowColor = '';
      }

      d3.selectAll('td')
        .on('mouseover', function(d, i) {
          // keep track the color of the row
          selectedRowColor = this.parentNode.style.backgroundColor;
          highlightRow(d3.select(this.parentNode)); // select row
        });

      d3.selectAll('td')
        .on('mouseout', function(d, i) {
          unHighlightRow(d3.select(this.parentNode));
        });


    }
  );

})();
