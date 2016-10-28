//Dependencies
var gulp = require('gulp-help')(require('gulp')),
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
	options = require('gulp-options'),
	confirm = require('gulp-confirm'),
	zip = require('gulp-zip'),
	filenames = require('gulp-filenames'),
	foreach = require('gulp-foreach'),
	insert = require('gulp-insert'),
	insertLines = require('gulp-insert-lines'),
	fs = require('fs'),
	runSeq = require('run-sequence'),
	path = require('path'),
	opn = require('opn');

//Paths Directories
var paths = {
	//imageMinifier paths
	imgMinToolInput: 'tools/imageMinifier/input/**/*',
	imgMinToolOutput: 'tools/imageMinifier/output',

	//jsMinifier paths
	jsMinToolInput: 'tools/jsMinifier/input/**/*',
	jsMinToolOutput: 'tools/jsMinifier/output',

	//cssMinifier paths
	cssMinToolInput: 'tools/cssMinifier/input/**/*',
	cssMinToolOutput: 'tools/cssMinifier/output',
	
	//zipMaker paths
	zipMakerToolInput: 'tools/zipMaker/input/*',
	zipMakerToolOutput: 'tools/zipMaker/output',

	//bannerTemplate paths
	bannerTemplate: 'banners/source/template',
	bannerProduction: 'banners/production'
};

/*var server = {
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
});*/

//***** Banners Task *****//
var bannerData = JSON.parse(fs.readFileSync('banners/source/settings/banner-properties.json'));
var dimensions = "";

gulp.task('createBanners', 'Generate banners', function() {

	runSeq('createSizes', 'injectProperties');

});

gulp.task('createSizes', false, ()=> {
	for (i = 0; i < bannerData.bannerProperties.dimensions.length; i++) { 
		dimensions = bannerData.bannerProperties.dimensions[i];

	gulp.src(paths.bannerTemplate+'/**/*')
		.pipe(gulp.dest(paths.bannerProduction+'/'+dimensions));

	}
})

gulp.task('injectProperties', false, ()=> {
	for (i = 0; i < bannerData.bannerProperties.dimensions.length; i++) { 
		dimensions = bannerData.bannerProperties.dimensions[i];

	var bannerwidth = dimensions.slice(0,3);
	var bannerheight = dimensions.slice(4);

	gulp.src(paths.bannerProduction+'/'+dimensions+'/css/_properties.scss')
		.pipe(insert.append('$banner-width: '+bannerwidth+'px;\n'))
		.pipe(insert.append('$banner-width: '+bannerheight+'px;'))
		.pipe(gulp.dest(paths.bannerProduction+'/'+dimensions+'/css'))
	}
})



/*gulp.task('img', false, ()=> {
	img.pipe(gulp.dest(paths.bannerProduction+'/'+dimensions+'/img'))
})

gulp.task('sass', false, ()=> {
	var bannerwidth = dimensions.slice(0,3);
	var bannerheight = dimensions.slice(4);

	propertiesScss.pipe(insert.append('$banner-width: '+bannerwidth+'px;\n'))
			 	  .pipe(insert.append('$banner-width: '+bannerheight+'px;'))
				  .pipe(gulp.dest(paths.bannerProduction+'/'+dimensions+'/css'))
});*/

//***** Tools Tasks *****//

//Image Minifier
gulp.task('imgmintool', 'Optimize your images.', function() {

    if (options.has('clean')) {
    
	    if (options.has('input')){
	    	gulp.src([paths.imgMinToolInput])
			.pipe(clean());
	    } else if (options.has('output')){
	    	gulp.src([paths.imgMinToolOutput])
			.pipe(clean());
	    } else if (options.has('clean')) {
	    	gulp.src([paths.imgMinToolInput,paths.imgMinToolOutput])
	    	.pipe(confirm({
		      question: 'Are you sure you want to delete the input and output files? [y/n]',
		      input: '_key:y'
    		}))
    		.pipe(clean());
	    } else {
	    	return false;
	    }
	    
    } else if (options.has('input')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp imgmintool|img-m'),'--clean --input');
	    gutil.log(gutil.colors.yellow('============================================================='));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp imgmintool|img-m'),'--clean --output');
	    gutil.log(gutil.colors.yellow('============================================================='));
    
    } else {
    gulp.src(paths.imgMinToolInput)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.imgMinToolOutput));
    }
    
}, {	aliases: ['img-m'], 
		options: {
			'clean':'Delete input and output files.',
			'output':'Use with --clean to delete the output files.',
			'input':'Use with --clean to delete the input files.'
		}
});

//Js Minifier
gulp.task('jsmintool', 'Minify your JavaScript files.', function() {
	
	if (options.has('clean')) {
    
	    if (options.has('input')){
	    	gulp.src([paths.jsMinToolInput])
			.pipe(clean());
	    } else if (options.has('output')){
	    	gulp.src([paths.jsMinToolOutput])
			.pipe(clean());
	    } else if (options.has('clean')) {
	    	gulp.src([paths.imgMinToolInput,paths.imgMinToolOutput])
	    	.pipe(confirm({
		      question: 'Are you sure you want to delete the input and output files? [y/n]',
		      input: '_key:y'
    		}))
    		.pipe(clean());
	    } else {
	    	return false;
	    }
	    
	} else if (options.has('input')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp jsmintool|js-m'),'--clean --input');
	    gutil.log(gutil.colors.yellow('============================================================='));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp jsmintool|js-m'),'--clean --output');
	    gutil.log(gutil.colors.yellow('============================================================='));
		
    } else {
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
    }		
}, {	aliases: ['js-m'], 
		options: {
			'clean':'Delete input and output files.',
			'output':'Use with --clean to delete the output files.',
			'input':'Use with --clean to delete the input files.'
		}
});

//Css Minifier
gulp.task('cssmintool', 'Minify your CSS files.', function() {
	
	if (options.has('clean')) {
    
	    if (options.has('input')){
	    	gulp.src([paths.cssMinToolInput])
			.pipe(clean());
	    } else if (options.has('output')){
	    	gulp.src([paths.cssMinToolOutput])
			.pipe(clean());
	    } else if (options.has('clean')) {
	    	gulp.src([paths.imgMinToolInput,paths.imgMinToolOutput])
	    	.pipe(confirm({
		      question: 'Are you sure you want to delete the input and output files? [y/n]',
		      input: '_key:y'
    		}))
    		.pipe(clean());
	    } else {
	    	return false;
	    }
	    
	} else if (options.has('input')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp cssmintool|css-m'),'--clean --input');
	    gutil.log(gutil.colors.yellow('============================================================='));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp cssmintool|css-m'),'--clean --output');
	    gutil.log(gutil.colors.yellow('============================================================='));
	
    } else {
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
		
    }	
}, {	aliases: ['css-m'], 
		options: {
			'clean':'Delete input and output files.',
			'output':'Use with --clean to delete the output files.',
			'input':'Use with --clean to delete the input files.'
		}
});

//Zip Maker
gulp.task('ziptool', 'Zip your folders individually.', function() {
	
	if (options.has('clean')) {
    
	    if (options.has('input')){
	    	gulp.src([paths.zipMakerToolInput])
			.pipe(clean());
	    } else if (options.has('output')){
	    	gulp.src([paths.zipMakerToolOutput])
			.pipe(clean());
	    } else if (options.has('clean')) {
	    	gulp.src([paths.zipMakerToolInput,paths.zipMakerToolOutput])
	    	.pipe(confirm({
		      question: 'Are you sure you want to delete the input and output files? [y/n]',
		      input: '_key:y'
    		}))
    		.pipe(clean());
	    } else {
	    	return false;
	    }
	    
	} else if (options.has('asone')) {
		return gulp.src(paths.zipMakerToolInput+'/**/*')
			.pipe(zip('package.zip'))
			.pipe(gulp.dest(paths.zipMakerToolOutput));
	    
    } else if (options.has('input')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp zipup'),'--clean --input');
	    gutil.log(gutil.colors.yellow('============================================================='));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow('============================================================='));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp zipup'),'--clean --output');
	    gutil.log(gutil.colors.yellow('============================================================='));
    
    } else {
	return gulp.src(paths.zipMakerToolInput)
       .pipe(foreach(function(stream, file){
          var fileName = file.path.substr(file.path.lastIndexOf("/")+1);
          gulp.src(cwd: paths.zipMakerToolInput+fileName+"**/*")
              .pipe(zip(fileName+".zip"))
              .pipe(gulp.dest(paths.zipMakerToolOutput));

          return stream;
       }));
    }
}, {
	
	aliases: ['zip-m'],
	options: {
			'asone':'Zip your files into one.',
			'clean':'Delete input and output files.',
			'output':'Use with --clean to delete the output files.',
			'input':'Use with --clean to delete the input files.'
		}
});

//Minifier & Optimazation Tool
gulp.task('img-m', false, ['imgmintool']);
gulp.task('js-m', false, ['jsmintool']);
gulp.task('css-m', false, ['cssmintool']);
gulp.task('zip-m', false, ['ziptool']);

//Default Tasks
gulp.task('default', false, function() {
	gutil.log('Working gulp!');
});