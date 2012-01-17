VisioNYC
========

A visualizer for NYC zipcode-based data using d3.js's geographic framework.
Intended to be an example of how to use the geographic framework, since the
documentation doesn't make it that obvious of all the gotchas.  Eventually, I
want users to be able to upload their own datasets in a specified format, and be
able to see it in a choropleth map.  Currently the only (and default) dataset is
Con Edison-provided electricity data from 2010.

Dependencies
------------

### Libraries

* [Bootstrap](http://twitter.github.com/bootstrap/) -- Grids, tables, and layouts management
* [d3.js](http://mbostock.github.com/d3/) -- Data-driven transformations and bindings
* [jQuery](http://jquery.com/)

### Cartography!

* [Colorbrewer](http://colorbrewer2.org/) -- Color advice for cartography
* [GDAL](http://www.gdal.org/) -- Tools for translating between different geodata formats
* [MapShaper](http://mapshaper.com/test/MapShaper.swf) -- Online tool for manipulating Shapefiles

### Datasets

* [NYC Open Data](http://nycopendata.socrata.com/) -- NYC's public data and API initiative
