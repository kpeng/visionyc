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

Running
-------

A really simple node.js server.js file is provided for convenience, but the code
as it stands is all static files, so you could use nginx or Apache to serve the
static files.  If you wish to run it using node.js, do:

```node server.js```

and go to `http://localhost:8080/`.

Data Specification
------------------

The uploaded data specification is as follows:

    {
        "specification": [{
            "id": "feature-1", // Will also determine option id in form select
            "text": "Feature 1",
            "per-capita": true // Boolean value to toggle per-capita support for this feature
        }, {
            "id": "feature-2",
            "text": ...,
            "per-capita": ...
        }],
        "data": {
            "10001": { // Keys need to be zipcodes
                "feature-1": 1, // Key needs to match ids in specification section
                "feature-2": 2, // Values are assuming to be numbers
            },
            "10002": {
                "feature-1": 3,
                "feature-2": 4,
            },
            ...
        }
    }
