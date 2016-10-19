//Dependencies
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	clean = require('gulp-clean'),
	minify = require('gulp-minifier'),
	sass = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	sassLint = require('gulp-sass-lint'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename');

//Paths Directories
var paths = {
	//imageMinifier paths
	imgMinToolInput: 'tools/imageMinifier/input/**/*',
	imgMinToolOutput: 'tools/imageMinifier/output',

	//jsMinifier paths
	jsMinToolInput: 'tools/jsMinifier/input/**/*',
	jsMinToolOutput: 'tools/jsMinifier/output',

	//CssMinifier paths
	cssMinToolInput: 'tools/cssMinifier/input/**/*',
	cssMinToolOutput: 'tools/cssMinifier/output'
};

//***** Tools Tasks *****//

//Image Minifier
gulp.task('imgmintool', () =>
    gulp.src(paths.imgMinToolInput)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.imgMinToolOutput))
);

//Js Minifier
gulp.task('jsmintool', function() {
	gulp.src(paths.jsMinToolInput)
		.pipe(jshint('.jshintrc'))
  		.pipe(minify({
		    minify: true,
		    collapseWhitespace: true,
		    conservativeCollapse: true,
		    minifyJS: true,
  		}))
  		.pipe(rename({ suffix: '.min' }))
  		.pipe(gulp.dest(paths.jsMinToolOutput));
});

//Css Minifier
gulp.task('cssmintool', function() {
	gulp.src(paths.cssMinToolInput)
		.pipe(sassLint())
	    .pipe(sassLint.failOnError())
	    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  		.pipe(minify({
		    minify: true,
		    collapseWhitespace: true,
		    conservativeCollapse: true,
		    minifyCSS: true,
  		}))
  		.pipe(rename({ suffix: '.min' }))
  		.pipe(gulp.dest(paths.cssMinToolOutput));
});

//Clean Image Minifier Tool Output
gulp.task('clean-imgmintool', function() {
	gulp.src([paths.imgMinToolOutput])
		.pipe(clean());
});

//Clean JavaScript Minifier Tool Output
gulp.task('clean-jsmintool', function() {
	gulp.src([paths.jsMinToolOutput])
		.pipe(clean());
});

//Clean CSS Minifier Tool Output
gulp.task('clean-cssmintool', function() {
	gulp.src([paths.cssMinToolOutput])
		.pipe(clean());
});


//Clean Tool All
gulp.task('cleantool', function() {
	gulp.src([
		
		paths.imgMinToolOutput,
		paths.jsMinToolOutput,
		paths.cssMinToolOutput
		
		])
		.pipe(clean());
});



//Default Tasks
gulp.task('godmode', ['imgmintool','jsmintool','cssmintool']);
gulp.task('default', function() {
	gutil.log('Working gulp!');
});