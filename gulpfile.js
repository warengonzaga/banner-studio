//Dependencies
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	clean = require('gulp-clean'),
	minify = require('gulp-minifier'),
	sass = require('gulp-sass'),
	jshint = require('gulp-jshint'),
	sassLint = require('gulp-sass-lint'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	webserver = require('gulp-webserver'),
	plumber = require('gulp-plumber'),
	opn = require('opn');

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

var server = {
  host: 'localhost',
  port: '8001'
}

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port );
});

gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      directoryListing: false
    }));
});

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
gulp.task('clean-imgmintool-input', function() {
	gulp.src([paths.imgMinToolInput])
		.pipe(clean());
});

//Clean JavaScript Minifier Tool Output
gulp.task('clean-jsmintool-input', function() {
	gulp.src([paths.jsMinToolInput])
		.pipe(clean());
});

//Clean CSS Minifier Tool Output
gulp.task('clean-cssmintool-input', function() {
	gulp.src([paths.cssMinToolInput])
		.pipe(clean());
});


//Clean Tool All Input
gulp.task('cleantool-input', function() {
	gulp.src([
		
		paths.imgMinToolInput,
		paths.jsMinToolInput,
		paths.cssMinToolInput
		
		])
		.pipe(clean());
});

//Clean Image Minifier Tool Output
gulp.task('clean-imgmintool-output', function() {
	gulp.src([paths.imgMinToolOutput])
		.pipe(clean());
});

//Clean JavaScript Minifier Tool Output
gulp.task('clean-jsmintool-output', function() {
	gulp.src([paths.jsMinToolOutput])
		.pipe(clean());
});

//Clean CSS Minifier Tool Output
gulp.task('clean-cssmintool-output', function() {
	gulp.src([paths.cssMinToolOutput])
		.pipe(clean());
});


//Clean Tool All Output
gulp.task('cleantool-output', function() {
	gulp.src([
		
		paths.imgMinToolOutput,
		paths.jsMinToolOutput,
		paths.cssMinToolOutput
		
		])
		.pipe(clean());
});

/**
 * 
 * Shortcut Commands
 * 
 **/
 
//Clean Tool
gulp.task('cto', ['cleantool-output']);
gulp.task('c-img-o', ['clean-imgmintool-output']);
gulp.task('c-css-o', ['clean-cssmintool-output']);
gulp.task('c-js-o', ['clean-jsmintool-output']);
gulp.task('cti', ['cleantool-input']);
gulp.task('c-img-i', ['clean-imgmintool-input']);
gulp.task('c-css-i', ['clean-cssmintool-input']);
gulp.task('c-js-i', ['clean-jsmintool-input']);

//Minifier Tool
gulp.task('img-m', ['imgmintool']);
gulp.task('js-m', ['jsmintool']);
gulp.task('css-m', ['cssmintool']);


//Default Tasks
/*gulp.task('godmode', ['imgmintool','jsmintool','cssmintool']);*/
gulp.task('default', function() {
	gutil.log('Working gulp!');
});