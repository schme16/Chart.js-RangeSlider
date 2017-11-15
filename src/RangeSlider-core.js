function RangeSliderChart (opts) {
	var ranger = {
		chartProto: new Chart(opts.chartCTX),
		datasets: opts.chartData,
		chartOpts: opts.chartOpts || {},
		options: opts,
		sliderElement: $('<div>'),

		_getData: function (min, max) {

			var d = {},
			Datasets = JSON.parse(JSON.stringify(ranger.datasets))
			d.labels = Datasets.labels.splice(min, (max-min || 1))
			d.datasets = []
			for (var i in Datasets.datasets) {
				var nD = Datasets.datasets[i]
					nD.data = nD.data.splice(min, (max-min || 1))
					nD.pointBackgroundColor = nD.pointBackgroundColor.splice(min, max - min || 1)
					nD.pointBorderColor = nD.pointBorderColor.splice(min, max - min || 1)
				d.datasets.push(nD)
			}

			return d
		},

		_draw: function (ctx, data, options, opts) {
			if (!ranger.chart) {

				ranger.chart = new Chart(ctx, {
					type: opts.chartType || options.type || 'line',
					data: data,
					options: options
				})
			}
			else {
				ranger.chart.data.datasets = data.datasets
				ranger.chart.data.labels = data.labels
				ranger.chart.update()
			}
		},

		_create: function () {

			noUiSlider.create(ranger.sliderElement[0], {
                start: ranger.options.initial,
                step: 1,
                connect: true,
                range: {
                    'min': 0,
                    'max': ranger.datasets.datasets[0].data.length -1
                }
            })

            ranger.sliderElement[0].noUiSlider.on('slide', function (b) {
                ranger._min = parseInt(b[0])
            	ranger._max = parseInt(b[1]) + 1
            	console.log(ranger._min, ranger._max)
            })

            ranger.sliderElement[0].noUiSlider.on('change', function (b) {
				if (ranger.chart) {
					ranger._draw(opts.chartCTX, ranger._getData( ranger._min, ranger._max ), ranger.chartOpts, ranger.opts)
				}
            })


			ranger.sliderElement.insertAfter(opts.chartCTX.canvas)

			ranger._draw(opts.chartCTX, ranger._getData( ranger.options.initial[0], ranger.options.initial[1] ), ranger.chartOpts, ranger.options)
		}

	}



	ranger.sliderElement
		.addClass('range-slider')
		.css({
			width: opts.chartCTX.canvas.width - 50
		})

	//TODO: add rangeslider width adjustment
	$(window).on('resize', function () {
		ranger.sliderElement.css({
			width: opts.chartCTX.canvas.width - 50
		})
	})

	ranger._create()
	return ranger
}
