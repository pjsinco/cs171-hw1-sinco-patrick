(function() {

  console.log('table table table');

  d3.text(
    'unemp_states_us_nov_2013.tsv', 
    'text/plain', 
    function(data) {
      d3.tsv.parseRows(data);
      var table = d3.select('body').append('table');
      var tbody = table.append('tbody');

      var rows = tbody.selectAll('tr')
        .data(d3.tsv.parseRows(data))
        .enter().append('tr');

      var cells = rows.selectAll('td')
        .data(function(row) {
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
