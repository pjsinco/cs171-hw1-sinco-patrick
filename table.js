(function() {

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
 
      // set the column headers
      thead.selectAll('th')
        .data(parsed[0])
        .enter().append('th')
          .attr('class', function(d, i) {
            // only add to 2nd, 3rd cols
            if (i != 0) {
              return 'asc'; 
            }
          })
          .text(function(d) {
            return d;
          });

      parsed.shift(); // remove header row

      // create all the empty rows we'll need
      var rows = tbody.selectAll('tr')
        .data(parsed)
        .enter().append('tr')

      // create all the cells and populate each with a datum
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

      // add zebra stripes to rows
      var stripeRows = function() {
        tbody.selectAll('tr')
          .style('background-color', function(d, i) {
            if (i % 2 == 0) {
              return '#d0d0d0';
            } else {
              return '#ffffff';
            }
          });
      }

      stripeRows();

      // keep track of row's original color,
      // before being highlighted
      var selectedRowColor;

      var highlightRow = function(row) {
        row.style('background-color', 'yellow');
      }

      var unHighlightRow = function(row) {
        row.style('background-color', selectedRowColor);
        selectedRowColor = null;
      }

      var columnCells = []; // track cell indices to highlight

      d3.selectAll('td')
        .on('mouseover', function(d, i) {

          // keep track the color of the row
          selectedRowColor = this.parentNode.style.backgroundColor;

          // select current row and highlight
          highlightRow(d3.select(this.parentNode));

          // set column number to highlight: 0, 1 or 2
          var colNum;
          if (i % 3 == 0) {
            colNum = 0;
          } else if ((i - 1) % 3 == 0) {
            colNum = 1; 
          } else {
            colNum = 2;
          }

          // add all cells in the column to highlight
          var allCells = d3.selectAll('td');
          for (var index = 0; index < allCells[0].length;
            index += 3) {
            columnCells.push(index + colNum);
          }

          // highlight the cells in our column
          d3.selectAll('td')
            .filter(function(d, i) {
              return columnCells.indexOf(i) > -1;
            })
              .style('background-color', 'yellow');
        });

      d3.selectAll('td')
        .on('mouseout', function(d, i) {
          unHighlightRow(d3.select(this.parentNode));
          d3.selectAll('td')
            .filter(function(d, i) {
              return columnCells.indexOf(i) > -1;
            })
              .style('background-color', null); // remove style

          // reset columns to highlight
          columnCells = [];
        });

      //d3.select('th:nth-child(2)')
      //thead.selectAll('th:not(:first-child)')
      thead.selectAll('th')
        .on('mouseover', function() {
          d3.select(this)
            .style('class', function() {
              var headerClass = d3.select(this)
                .attr('class');
              if (headerClass == 'desc') {
                return 'asc'; 
              } else if (headerClass == 'asc') {
                return 'desc'; 
              }
            });
            //.style('cursor', 'pointer');
        });

      var reOrder = function(rows, order, col) {
        rows.sort(function(a, b) {
          if (order == 'asc') {
            return d3.descending(a[col], b[col]);
          } else {
            return d3.ascending(a[col], b[col]);
          }
        });
      }

      stripeRows();

      // sort by state name
      thead.select('th:nth-child(2)')
        .on('click', function(d, i) {

          // check the class so we know how to sort
          var curOrder = d3.select(this).attr('class');
          var rows = (tbody.selectAll('tr'));
          reOrder(rows, curOrder, 1);

          d3.select(this)
            .attr('class', function() {
              return curOrder == 'asc' ? 'desc' : 'asc';
            });

          stripeRows();
        });

      // sort by rate 
      thead.select('th:nth-child(3)')
        .on('click', function(d, i) {

          // check the class so we know how to sort
          var curOrder = d3.select(this).attr('class');

          tbody.selectAll('tr')
            .sort(function(a, b) {
              if (curOrder == 'desc') {

                // if we have a rate tie, first sort by state name
                if (d3.ascending(parseFloat(a[2]), parseFloat(b[2])) 
                  == 0) {

                  // return the sorted state names
                  return d3.ascending(a[1], b[1]); 
                }
                return d3.ascending(parseFloat(a[2]),
                  parseFloat(b[2]));
              } else {

                // if we have a rate tie, first sort by state name
                if (d3.descending(parseFloat(a[2]), parseFloat(b[2])) 
                  == 0) {

                  // return the sorted state names
                  return d3.descending(a[1], b[1]); 
                }
                return d3.descending(parseFloat(a[2]),
                  parseFloat(b[2]));
              }
            });

          d3.select(this)
            .attr('class', function() {
              return curOrder == 'asc' ? 'desc' : 'asc';
            });

          stripeRows();
        });

    } // end d3.text()
  );

})();
