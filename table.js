(function() {

  console.log('table table table');

  d3.text(
    'unemp_states_us_nov_2013.tsv', 
    'text/plain', 
    function(data) {
      var title = 'Unemployment Rates for States\n';
      title += 'Monthly Rankings\n';
      title += 'Seasonally Adjusted\n';
      title += 'Nov. 2013';

      d3.select('body').append('h1')
        .text('Unemployment Rates for States');
      var parsed = d3.tsv.parseRows(data);
      var table = d3.select('body').append('table');
      var caption = d3.select('table').append('caption')
      
      var thead = table.append('thead').append('tr');
      var tbody = table.append('tbody');

      d3.select('caption')
        .text(title);

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
        .enter().append('tr');

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
    }
  );

})();
