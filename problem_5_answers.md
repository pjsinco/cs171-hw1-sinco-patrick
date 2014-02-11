**1.** The chart is missing a description of what the chart is displaying and what the bars and their lengths represent. Because of these missing elements, the chart is not usable in its current form.

**2.** The top-level <g> element groups the entire chart; that element helps us position the chart on the page. 

The next <g> groups all the bars; that will let us operate on all the bars and anything nested inside it.

The last <g> groups each <rect> element and any other information we'll be adding to each bar, such as text.

**3.** Yes, because the order in which we add elements affects their z-index. Items that come later are on a higher layer. So if we add the <rect> elements after the text, they will cover up the rates, which we're placing inside the <rect> elements.
