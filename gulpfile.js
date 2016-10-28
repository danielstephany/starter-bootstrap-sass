'use strict'

var gulp =    require('gulp');
var concat =  require('gulp-concat'); //used for concatinating js files
var uglify =  require('gulp-uglify'); //used to minify js files
var rename =  require('gulp-rename'); //used to rename files
var sass =    require('gulp-sass');	//used to compile sass
var maps =    require('gulp-sourcemaps'); //used to make sourcemaps files for js, css, scss,less
var cssnano = require('gulp-cssnano'); // used to minify css
var del =     require('del'); // used to delete files for clean up
var autoprefixer = require('gulp-autoprefixer'); //used to auto add vendor prefixes to css
var browserSync =  require('browser-sync'); //reloads browser after saving a change to a file
var twig =         require('gulp-twig'); //templates html
var prettify =     require('gulp-prettify'); //properly indents html files
var plumber = 	   require('gulp-plumber'); //error handler for gulp

// js files to be concatinated in this order
var scripts = [
		'bower_vendors/jquery/dist/jquery.min.js',
		'bower_vendors/jquery-touch-events/src/jquery.mobile-events.min.js',
		'bower_vendors/bootstrap-sass/assets/javascripts/bootstrap.js',
		'./src/assets/js/main.js'];
// file paths to the fonts
var fonts = ['bower_vendors/bootstrap-sass/assets/fonts/**/*.*', 'bower_vendors/font-awesome/fonts/*.*'];


// Compile Twig templates to HTML
gulp.task('template', function() {
	return gulp.src('src/templates/*.html') // run the Twig template parser on all .html files in the "src" directory
	.pipe(plumber())
	.pipe(twig())
	.pipe(prettify())
	.pipe(gulp.dest('./dist')) // output the rendered HTML files to the "dist" directory
	.pipe(browserSync.stream());
});

// concatinates js from the scripts var into one file app.js,
// and places the file in dist/js
gulp.task('concatScripts', function() {
	return gulp.src(scripts)
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./dist/assets/js'));
});


// concatinates js from the scripts var into one file app.js,
// minifys app.js into app.min.js,
// then writes the source maps,
// places both files in ./js,
// and reloads the browser
gulp.task('minifyScripts', function() {
	return gulp.src(scripts)
	.pipe(plumber())
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(uglify())
	.pipe(rename("app.min.js"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./dist/assets/js'))
	.pipe(browserSync.stream());
});

// compiles sass from scss/main.scss to main.css
// adds prefixes with auto prefixer to css
// writes source maps
// places both in dist/css
gulp.task('compileSass', function() {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(autoprefixer({browsers:['last 2 versions']}))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/assets/css'));
});

// compiles sass from scss/main.scss to main.css
// adds prefixes with auto prefixer to css
// minifies css to main.min.css
// writes source maps
// places both in dist/css
gulp.task('minifyCss', function() {
	return gulp.src('src/assets/scss/main.scss')
	.pipe(plumber())
	.pipe(maps.init())
	.pipe(sass())
	.pipe(autoprefixer({browsers:['last 2 versions']}))
	.pipe(cssnano())
	.pipe(rename("main.min.css"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./dist/assets/css'))
	.pipe(browserSync.stream());
});

//gets the fonts from bower components and places them in dist/assets/fonts
gulp.task('getFonts', function () {
	return gulp.src(fonts)
	.pipe(gulp.dest('./dist/assets/fonts'));
});

// starts development server at localhost:3000
// watches html, js, and scss and runs associated tasks
gulp.task('watchFiles',['build'], function() {
	browserSync.init({
        server: "./dist"
    });
	gulp.watch('./src/assets/scss/**/*.scss', ['minifyCss']);
	gulp.watch('./src/assets/js/**/*.js', ['minifyScripts']);
	gulp.watch('./src/templates/**/*.html', ['template']);
});

// builds the dist directory and by running associated tasks
// that place their contents in dist, and by placing the folders and 
// files returned from gulp.src into dist 
gulp.task('build', ['template', 'getFonts', 'minifyScripts', 'minifyCss','compileSass','concatScripts'], function() {
	return gulp.src(["src/assets/img/**"], { base: './src'})
	.pipe(gulp.dest('dist'));
});

// deletes all folders created by gulp tasks
gulp.task('clean', function(){
	del(['dist']);
});

// default task is set to start the watch listeners
gulp.task('default', [], function() {
	gulp.start(['watchFiles']);
});

