(function() {

  console.log('table table table');

  d3.text(
    'unemp_states_us_nov_2013.tsv', 
    'text/plain', 
    function(data) {
      var parsed = d3.tsv.parseRows(data);
      var table = d3.select('body').append('table');
      var thead = table.append('thead').append('tr');
      var tbody = table.append('tbody');

      thead.selectAll('th')
        .data(parsed[0])
        .enter().append('th')
          .text(function(d) {
            return d;
          });

      parsed.shift(); // remove header

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
