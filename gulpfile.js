gulp = require('gulp');
plugins = require('gulp-load-plugins')();
fs = require('fs');
del = require('del');
path = require('path');


var staticJS = {
		jquery: 'bower_components/jquery/dist/jquery.min.js',
		chartjs: 'bower_components/Chart.js/dist/Chart.bundle.js',
		nouislider: 'bower_components/nouislider/distribute/nouislider.min.js',
	},

	staticCss = {
		nouislider: 'bower_components/nouislider/distribute/nouislider.min.css',
	},

	srcJS = [
		'src/RangeSlider-core.js'
	],

	srcCSS = [
		'src/RangeSlider-core.css'
	]

	outputDir = 'dist',

/*	buildChains = {
		solo: {
			js: src,
			chain: ['Build Source', 'Concat']
		}
		
		all: {
			chain: ['Build Source']
			js: [
				staticJS.jquery,
				staticJS.chartjs,
				staticJS.nouislider,
				src
			],
			css: [
				staticCss.nouislider
			]
		}
	}
*/



gulp.task('Start', function () {
	del.sync([outputDir], {force: true})
	return gulp		
});

gulp.task('Finish', ['Start', 'Build All'], function () {
	return gulp		
});

gulp.task('default', ['Finish', 'Watch']);

gulp.task('Watch', function () {
	gulp.watch('src/*', ['Finish'])
});

gulp.task('Build CSS', function () {
	return gulp.src(srcCSS)
	.pipe(plugins.autoprefixer())
	//.pipe(plugins.minifyCSS())
	.pipe(plugins.concat('RangeSlider-solo.min.css'))
	.pipe(gulp.dest(outputDir));
});

gulp.task('Build Minimal CSS', ['Build CSS'], function () {
	return gulp.src([
		staticCss.nouislider,
		outputDir + '/RangeSlider-solo.min.css'
	])
	.pipe(plugins.autoprefixer())
	//.pipe(plugins.minifyCSS())
	.pipe(plugins.concat('RangeSlider-minimal.min.css'))
	.pipe(gulp.dest(outputDir));
});

gulp.task('Build All CSS', ['Build Minimal CSS'], function () {
	return gulp.src([
		staticCss.nouislider,
		outputDir + '/RangeSlider-solo.min.css'
	])
	.pipe(plugins.autoprefixer())
	//.pipe(plugins.minifyCSS())
	.pipe(plugins.concat('RangeSlider-all.min.css'))
	.pipe(gulp.dest(outputDir));
});



gulp.task('Build Source', ['Build All CSS'], function () {
	return gulp.src(srcJS)
	.pipe(plugins.uglify({mangle:false}))
	.pipe(plugins.concat('RangeSlider-solo.min.js'))
	.pipe(gulp.dest(outputDir));
});

gulp.task('Build Minimal', ['Build Source'], function () {
	return gulp.src([
		staticJS.nouislider,
		outputDir + '/RangeSlider-solo.min.js'
	])
	.pipe(plugins.concat('RangeSlider-minimal.min.js'))
	.pipe(gulp.dest(outputDir));
});

gulp.task('Build All', ['Build Minimal'], function () {
	return gulp.src([
		staticJS.jquery,
		staticJS.chartjs,
		outputDir + '//RangeSlider-minimal.min.js'
	])
	.pipe(plugins.concat('RangeSlider-all.min.js'))
	.pipe(gulp.dest(outputDir));
});



