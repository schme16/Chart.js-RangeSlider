function RangeSliderChart(opts) {
	var ranger = {
		chartProto: new Chart(opts.chartCTX),
		datasets: opts.chartData,
		chartOpts: opts.chartOpts || {},
		options: opts,
		sliderElement: $('<div>').addClass('range-slider').width(opts.chartCTX.canvas.width),

		_getData: function (min, max) {
			
			var d = {},
			Datasets = JSON.parse(JSON.stringify(ranger.datasets));
			d.labels = Datasets.labels.splice(min, (max-min || 1));
			d.datasets = [];
			for (var i in Datasets.datasets) {
				var nD = Datasets.datasets[i]
					nD.data = nD.data.splice(min, (max-min || 1));
				d.datasets.push(nD);
			}

			return d;
		},

		_create: function () {

 			ranger.sliderElement.noUiSlider({
                start: ranger.options.initial,
                step: 1,
                connect: true,
                range: {
                    'min': 0,
                    'max': ranger.datasets.datasets[0].data.length -1
                }
            })
            .on({
                slide: function (b) {
                    ranger._min = parseInt($(b.target).val()[0]);
                    ranger._max = parseInt($(b.target).val()[1]);
                },

                change: function (b) {

                    ranger.chart.destroy();
           			ranger.chart = ranger.chartProto[ranger.options.chartType](ranger._getData( ranger._min, ranger._max ), ranger.chartOpts);
                }
            })
            /*.Link('lower').to($('#from'), null, wNumb({
                decimals: 0
            }))
            .Link('upper').to($('#to'), null, wNumb({
                decimals: 0
            }))*/

	
			ranger.sliderElement.insertAfter(opts.chartCTX.canvas)
			
			if(ranger.chart) ranger.chart.destroy();
           	ranger.chart = ranger.chartProto[ranger.options.chartType](ranger._getData( ranger.options.initial[0], ranger.options.initial[1] ), ranger.chartOpts);
		}

	}

	ranger._create()
	return ranger
}