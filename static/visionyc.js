var type = 'commercial';
var population, electricity_usage, quantile;

var margin = 25;
var width = window.innerWidth * 3/4 - margin,
    height = window.innerHeight - 50 - margin;

// Equirectangular projection isn't very nice to look at, but the projection
// function is very simple, and that makes it easy to solve for the ideal
// scale and translation, which we do later
var projection = d3.geo.equirectangular();

var path = d3.geo.path().projection(projection);

function format(number) {
	number += '';
	x = number.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1].substr(0, 2) : '';
	var regexp = /(\d+)(\d{3})/;
	while (regexp.test(x1))
		x1 = x1.replace(regexp, '$1' + ',' + '$2');
	return x1 + x2;
}

d3.json('data/zipcodes.json', function(json) {
    //
    // Set up zip code boundary features
    //

    var features = json.features;

    var svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.behavior.zoom().on('zoom', redraw));

    var zipcodes = svg.append('g')
        .attr('id', 'nyc-zipcodes')
        .attr('class', 'Blues');

    zipcodes.selectAll('path')
        .data(features)
        .enter().append('path')
            .attr('d', path);

    // Figure out latitude and longitude bounds for our geography
    var longitude_bounds = [null, null],
        latitude_bounds = [null, null];

    features.forEach(function(feature) {
        var bounds = d3.geo.bounds(feature);
        if (longitude_bounds[0] == null || bounds[0][0] < longitude_bounds[0])
            longitude_bounds[0] = bounds[0][0];
        if (longitude_bounds[1] == null || bounds[1][0] > longitude_bounds[1])
            longitude_bounds[1] = bounds[1][0];
        if (latitude_bounds[0] == null || bounds[0][1] < latitude_bounds[0])
            latitude_bounds[0] = bounds[0][1];
        if (latitude_bounds[1] == null || bounds[1][1] > latitude_bounds[1])
            latitude_bounds[1] = bounds[1][1];
    });

    // Reverse-engineer the appropriate scale and translation factors if we want
    // [(min_longitude + max_longitude) / 2, max_latitude] to [width / 2, 0] and
    // [(min_longitude + max_longitude) / 2, min_latitude] to [width / 2, height]
    // i.e. scale the center-axis of our bounding box to the center-axis of the
    // SVG canvas (this is basically solving a system of three equations in three
    // unknowns)
    var scale = 360 * height / (latitude_bounds[1] - latitude_bounds[0]);
    var translation = [
        width / 2 - scale * (longitude_bounds[0] + longitude_bounds[1]) / 720,
        scale * latitude_bounds[1] / 360,
    ];

    projection.scale(scale);
    projection.translate(translation);
    zipcodes.selectAll('path').attr('d', path);

    // redraw() from http://bl.ocks.org/1283960
    function redraw() {
        // d3.event.translate (an array) stores the current translation from the
        // parent SVG element.  t (an array) stores the projection's default
        // translation.  We add the x and y vales in each array to determine the
        // projection's new translation
        var tx = translation[0] * d3.event.scale + d3.event.translate[0];
        var ty = translation[1] * d3.event.scale + d3.event.translate[1];
        projection.translate([tx, ty]);

        // Now we determine the projection's new scale, but there's a problem:
        // the map doesn't 'zoom onto the mouse point'
        projection.scale(scale * d3.event.scale);

        // Redraw the map
        zipcodes.selectAll('path')
            .attr('d', path);
    }

    //
    // Set up choropleth electricity_usage
    //

	d3.json('data/population.json', function(population_data) {
		population = population_data;

		d3.json('data/electricity.json', function(json) {
			electricity_usage = json;

			var values = [];
			for (var k in electricity_usage) {
				if (electricity_usage[k][type])
					values.push(electricity_usage[k][type]);
			}
			values.sort(function(a, b) { return a - b; });

			var ranges = [];
			for (var i = 0; i < values.length; ++i)
				ranges[i] = Math.floor(i / (Math.ceil(values.length / 9)));

			quantile = d3.scale.ordinal()
				.domain(values)
				.range(ranges);

			zipcodes.selectAll('path')
				.attr('original-title', function(d) {
					var output = electricity_usage[d.id] ? (electricity_usage[d.id][type] ? electricity_usage[d.id][type] : 0) : 0;
					return d.id + ': ' + format(output);
				})
				.html(function(d) {
					$(this).tipsy({ gravity: 'e' });
				});

			zipcodes.selectAll('path')
				.attr('class', quantize);
		});
	});

    function quantize(d) {
		var type_alias = type == 'residential-per-capita' ? 'residential' : type;
        if (electricity_usage[d.id] && electricity_usage[d.id][type_alias])
            return 'q' + ~~quantile(electricity_usage[d.id][type_alias]) + '-9';
        else
            return 'q0-9';
    }

	//
	// Handle choropleth transitions for drop-down list
	//

	$('#residence-type').change(function(ui) {
		type = ui.target.value;

        var values = [];
        for (var k in electricity_usage) {
			var type_alias = type == 'residential-per-capita' ? 'residential' : type;
            if (electricity_usage[k][type_alias]) {
				if (type == 'residential-per-capita')
	                values.push(electricity_usage[k][type_alias] / population[k]);
				else
	                values.push(electricity_usage[k][type_alias]);
            }
        }
        values.sort(function(a, b) { return a - b; });

		var ranges = [];
		for (var i = 0; i < values.length; ++i)
			ranges[i] = Math.floor(i / (Math.ceil(values.length / 9)));

        quantile = d3.scale.ordinal()
            .domain(values)
            .range(ranges);

        zipcodes.selectAll('path')
            .attr('original-title', function(d) {
				var type_alias = type == 'residential-per-capita' ? 'residential' : type;
				var usage = electricity_usage[d.id];
                var output = usage ? (usage[type_alias] ?
									  (type == 'residential-per-capita' ?
									   usage[type_alias] / population[d.id] : usage[type_alias]) : 0) : 0;
                return d.id + ': ' + format(output);
            });

        zipcodes.selectAll('path')
            .attr('class', quantize);
	});
});
