//Dependencies
var path = require('path'),
	fs = require('fs'),
	gulp = require('gulp-help')(require('gulp')),
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
	inject = require('gulp-inject'),
	concat = require('gulp-concat'),
	runSeq = require('run-sequence'),
	opn = require('opn');

//Paths Directories
var paths = {
	//data paths
	studioJSON: 'banners/source/resources/studio data/studio.json',
	bannerJSON: 'banners/source/settings/banner-properties.json',

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
	bannerFixtures: 'banners/fixtures',
	bannerSource: 'banners/source',
	bannerProduction: 'banners/production',
	bannerResources: 'banners/source/resources'
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
var studio = JSON.parse(fs.readFileSync(paths.studioJSON)),
	gulpMessages = studio.studiodata.gulphelp,
	bannerData = JSON.parse(fs.readFileSync(paths.bannerJSON)),
	dimensions;

gulp.task('createBanners', gulpMessages.gulpCreateBanners, function() {
	runSeq('createSizes');
	setTimeout(()=> {
		runSeq('injectProperties');
	}, 1000);
});

gulp.task('createSizes', false, ()=> {
	for (i = 0; i < bannerData.bannerProperties.dimensions.length; i++) { 
		dimensions = bannerData.bannerProperties.dimensions[i];

	gulp.src(paths.bannerTemplate+'/**/*')
		.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));
	};
});

gulp.task('injectProperties', false, ()=> {
	var bannerSettings = bannerData.bannerProperties;
	for (i = 0; i < bannerData.bannerProperties.dimensions.length; i++) { 
		dimensions = bannerData.bannerProperties.dimensions[i];

	var x = dimensions.indexOf("x"),
		bannerwidth = dimensions.slice(0,x),
		bannerheight = dimensions.slice((x+1), dimensions.length),
		bannerName = bannerData.bannerProperties.title,
		index = gulp.src(paths.bannerFixtures+'/'+dimensions+'/index.html');
		metaSizes = ('<meta name="ad.size" content="width='+bannerwidth+', height='+bannerheight+'"/>'),
		tabs = '   ';

	//Injecting Banner Properties on Html file.

	index//Injecting Standard Values
	.pipe(insertLines({
      'after': /<meta\s+charset=["']utf-8["']>$/,
      'lineAfter': tabs+'<title>'+bannerName+'</title>\n'+tabs+metaSizes
	}))
	.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

	var animationScript,
		bannerTypeData = bannerSettings.bannertype,
		bannerAnimationData = bannerSettings.gsap,
		bannerType = bannerTypeData.toLowerCase(),
		bannerAnimation = bannerAnimationData.toLowerCase(),
		dcm = 'doubleclick',
		sizmek = 'sizmek',
		standard = 'standard',
		tweenmax = 'tweenmax',
		tweenlite = 'tweenlite',
		timelinemax = 'timelinemax',
		timelinelite = 'timelinelite',
		defScript = 'js/bannerscript.js',
		ebloader = 'js/EBLoader.js',
		sTWMl = studio.studiodata.gsaplinks[0],
		sTWLl01 = studio.studiodata.gsaplinks[1], //cssplugin
		sTWLl02 = studio.studiodata.gsaplinks[2], //easepack
		sTWLl03 = studio.studiodata.gsaplinks[3], //tweenlite
		sTLMl = studio.studiodata.gsaplinks[4], //timelinemax
		sTLLl = studio.studiodata.gsaplinks[5], //timelinelite
		dcmTWMl = studio.studiodata.gsaplinks[6],
		dcmTWLl01 = studio.studiodata.gsaplinks[7], //cssplugin
		dcmTWLl02 = studio.studiodata.gsaplinks[8], //easepack
		dcmTWLl03 = studio.studiodata.gsaplinks[9], //tweenlite
		dcmTLMl = studio.studiodata.gsaplinks[10], //timelinemax
		dcmTLLl = studio.studiodata.gsaplinks[11], //timelinelite
		stS = '<script src="',
		enS = '"></script>',
		bannerScript = (stS+defScript+enS),
		ebloaderScript = (stS+ebloader+enS),
		standardTweenMax= (tabs+stS+sTWMl+enS+'\n'+tabs+bannerScript),
		standardTweenLite = (tabs+stS+sTWLl01+enS+'\n'+tabs+stS+sTWLl02+enS+'\n'+tabs+stS+sTWLl03+enS+'\n'+tabs+bannerScript),
		standardTimelineMax = (tabs+stS+sTWLl03+enS+'\n'+tabs+stS+sTLMl+enS+'\n'+tabs+bannerScript),
		standardTimelineLite = (tabs+stS+sTWLl03+enS+'\n'+tabs+stS+sTLLl+enS+'\n'+tabs+bannerScript),
		dcmTweenMax = (tabs+stS+dcmTWMl+enS+'\n'+tabs+bannerScript),
		dcmTweenLite = (tabs+stS+dcmTWLl01+enS+'\n'+tabs+stS+dcmTWLl02+enS+'\n'+tabs+stS+dcmTWLl03+enS+'\n'+tabs+bannerScript),
		dcmTimelineMax = (tabs+stS+dcmTWLl03+enS+'\n'+tabs+stS+dcmTLMl+enS+'\n'+tabs+bannerScript),
		dcmTimelineLite = (tabs+stS+dcmTWLl03+enS+'\n'+tabs+stS+dcmTLLl+enS+'\n'+tabs+bannerScript),
		sizmekTweenMax= (tabs+stS+sTWMl+enS+'\n'+tabs+ebloaderScript+'\n'+tabs+bannerScript),
		sizmekTweenLite = (tabs+stS+sTWLl01+enS+'\n'+tabs+stS+sTWLl02+enS+'\n'+tabs+stS+sTWLl03+enS+'\n'+tabs+ebloaderScript+'\n'+tabs+bannerScript),
		sizmekTimelineMax = (tabs+stS+sTWLl03+enS+'\n'+tabs+stS+sTLMl+enS+'\n'+tabs+ebloaderScript+'\n'+tabs+bannerScript),
		sizmekTimelineLite = (tabs+stS+sTWLl03+enS+'\n'+tabs+stS+sTLLl+enS+'\n'+tabs+ebloaderScript+'\n'+tabs+bannerScript);

	//Conditional Statement for DoubelClick Studio
	if(bannerType==dcm){

		gulp.src(['banners/source/resources/vendor/doubleclick/doubleclick.js','banners/source/template/js/*.js'])
			.pipe(concat('bannerscript.js'))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions+'/js'));

		if(bannerAnimation==tweenmax){
			//if DCM TweenMax
			animationScript = dcmTweenMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==tweenlite){
			//if DCM TweenLite
			animationScript = dcmTweenLite;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==timelinemax){
			//if DCM TimelineMax
			animationScript = dcmTimelineMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==timelinelite){
			//if DCM TimelineLite
			animationScript = dcmTimelineLite;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else {
			//default DCM TweenMax
			animationScript = dcmTweenMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));
		}

	//Conditional Statement for Sizmek
	} else if (bannerType==sizmek){

		gulp.src(['banners/source/resources/vendor/sizmek/sizmek.js','banners/source/template/js/*.js'])
			.pipe(concat('bannerscript.js'))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions+'/js'));

		gulp.src(paths.bannerResources+'/vendor/sizmek/EBLoader.js')
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions+'/js'));

		if(bannerAnimation==tweenmax){
			//if TweenMax
			animationScript = sizmekTweenMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==tweenlite){
			//if TweenLite
			animationScript = sizmekTweenLite;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==timelinemax){
			//if TimelineMax
			animationScript = sizmekTimelineMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==timelinelite){
			//if TimelineLite
			animationScript = sizmekTimelineLite;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else {
			//default TweenMax
			animationScript = sizmekTweenMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));
		}

	//Conditional Statement for Standard
	} else if(bannerType==standard){

		if(bannerAnimation==tweenmax){
			//if TweenMax
			animationScript = standardTweenMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==tweenlite){
			//if TweenLite
			animationScript = standardTweenLite;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==timelinemax){
			//if TimelineMax
			animationScript = standardTimelineMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else if (bannerAnimation==timelinelite){
			//if TimelineLite
			animationScript = standardTimelineLite;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));

		} else {
			//default TweenMax
			animationScript = standardTweenMax;
			index//Injecting Animation Library
			.pipe(insertLines({
		      'before': /<\/head>$/,
		      'lineBefore': animationScript
			}))
			.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions));
		}

	} else {
		return false;
	};

	//Injecting Banner Dimensions on Sass file.
	gulp.src(paths.bannerFixtures+'/'+dimensions+'/css/_properties.scss')
		.pipe(insert.append('$banner-width: '+bannerwidth+'px;\n'))
		.pipe(insert.append('$banner-width: '+bannerheight+'px;'))
		.pipe(gulp.dest(paths.bannerFixtures+'/'+dimensions+'/css'));

	}
});

gulp.task('godmode', 'To preview the live version of banner.', ()=> {
	gulp.src(paths.bannerSource+'/resources/scss/**/*.scss')
		.pipe(sassLint())
  		.pipe(sassLint.failOnError())
  		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  		.pipe(gulp.dest(paths.bannerProduction+'/'+dimensions+'/css'))
});

//***** Tools Tasks *****//

//Image Minifier
gulp.task('imgmintool', gulpMessages.gulpImgMinTool, function() {

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
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp imgmintool|img-m'),'--clean --input');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp imgmintool|img-m'),'--clean --output');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    
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
gulp.task('jsmintool', gulpMessages.gulpJSMinTool, function() {
	
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
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp jsmintool|js-m'),'--clean --input');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp jsmintool|js-m'),'--clean --output');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
		
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
gulp.task('cssmintool', gulpMessages.gulpCSSMinTool, function() {
	
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
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp cssmintool|css-m'),'--clean --input');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp cssmintool|css-m'),'--clean --output');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
	
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
gulp.task('ziptool', gulpMessages.gulpZipTool, function() {
	
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
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete input files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp zipup'),'--clean --input');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
	    
    } else if (options.has('output')) {
    	gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    	gutil.log(gutil.colors.yellow('WARNING: Use it with'),'--clean',gutil.colors.yellow('option to delete output files!!!'));
    	gutil.log(gutil.colors.yellow('EXAMPLE: gulp zipup'),'--clean --output');
	    gutil.log(gutil.colors.yellow(studio.studiodata.misc[0]));
    
	} else if (options.has('banner')) {

		return gulp.src(paths.zipMakerToolInput)
				   .pipe(foreach(function(stream, file){

				   	  var fileName = file.path.substr(file.path.lastIndexOf("/")+1),
						  packageName = ('./tools/zipMaker/input/'+fileName);

				      gulp.src(paths.zipMakerToolInput+fileName+'/**/*', {base: packageName})
				        .pipe(zip(fileName+".zip"))
				        .pipe(gulp.dest(paths.zipMakerToolOutput));

			  	      return stream;

				    }));

    } else {

	    return gulp.src(paths.zipMakerToolInput)
                   .pipe(foreach(function(stream, file){

                   	  var fileName = file.path.substr(file.path.lastIndexOf("/")+1);

			          gulp.src(paths.zipMakerToolInput+fileName+"/**/*")
			              .pipe(zip(fileName+".zip"))
			              .pipe(gulp.dest(paths.zipMakerToolOutput));
			          
			          return stream;

       				}));

    }

}, {
	
	aliases: ['zip-m'],
	options: {
			'banner':'Zip your files for '
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

gulp.task('info', function() {
	gutil.log();
	gutil.log();
	gutil.log(gutil.colors.white(studio.studiodata.misc[0]));
	gutil.log(gutil.colors.white.bold(studio.studiodata.studioname));
	gutil.log(gutil.colors.white('Version:'),gutil.colors.green.bold(studio.studiodata.version));
	gutil.log(gutil.colors.white('Build:'),gutil.colors.green.bold(studio.studiodata.build));
	gutil.log(gutil.colors.white(studio.studiodata.misc[0]));
	gutil.log(gutil.colors.white('Developed By:'),gutil.colors.green(studio.studiodata.developer));
	gutil.log(gutil.colors.white('Co-Developed By:'),gutil.colors.green(studio.studiodata.codeveloper));
	gutil.log(gutil.colors.white('Company:'),gutil.colors.green(studio.studiodata.company));
	gutil.log(gutil.colors.white('Description:'),gutil.colors.green(studio.studiodata.description));
	gutil.log(gutil.colors.white('Useful Command:'),gutil.colors.green(studio.studiodata.usefulcmd));
	gutil.log(gutil.colors.white('Git Repository:'),gutil.colors.green(studio.studiodata.gitrepo));
	gutil.log(gutil.colors.white('Year:'),gutil.colors.green(studio.studiodata.year));
	gutil.log(gutil.colors.white(studio.studiodata.misc[0]));
	gutil.log();
	gutil.log();
})

//Default Tasks
gulp.task('default', false, function() {
	gutil.log('Working gulp!');
});