'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat'); //used for concatinating js files
var uglify = require('gulp-uglify'); //used to minify js files
var rename = require('gulp-rename'); //used to rename files
var sass = require('gulp-sass');	//used to compile sass
var maps = require('gulp-sourcemaps'); //used to make sourcemaps files for js, css, scss,less
var minifyHTML = require('gulp-htmlmin'); //used to minify html
var cssnano = require('gulp-cssnano'); // used to minify css
var del = require('del'); // used to delete files for clean up
var autoprefixer = require('gulp-autoprefixer'); //used to auto add vendor prefixes to css
var browserSync = require('browser-sync'); //reloads browser after saving a change to a file

// js files to be concatinated in this order
var scripts = [
		'bower_vendors/jquery/dist/jquery.min.js',
		'bower_vendors/jquery-touch-events/src/jquery.mobile-events.min.js',
		'bower_vendors/bootstrap-sass/assets/javascripts/bootstrap.js',
		'js/assets/main.js'];

// reloads browser after saving change to html 
gulp.task("htmlReload", function(){
	gulp.src('./*.html', { base: './'})
	.pipe(browserSync.stream());
});

// minifies html and saves it to the dist folder
gulp.task("minifyHTML", function(){
	return gulp.src('./*.html', { base: './'})
	.pipe(minifyHTML({collapseWhitespace: true}))
	.pipe(gulp.dest("./dist"));
});

// concatinates js from the scripts var into one file app.js, 
// and places the file in dist/js
gulp.task('concatScripts', function() {
	return gulp.src(scripts)
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/js'));
});

// concatinates js from the scripts var into one file app.js,
// minifys app.js into app.min.js,
// then writes the source maps,
// places both files in ./js,
// and reloads the browser
gulp.task('minifyScripts', function() {
	return gulp.src(scripts)
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(uglify())
	.pipe(rename("app.min.js"))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./js'))
	.pipe(browserSync.stream());
});

// compiles sass from scss/main.scss to main.css
// adds prefixes with auto prefixer to css
// writes source maps
// places both in dist/css
gulp.task('compileSass', function() {
	return gulp.src('scss/main.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({browsers:['last 2 versions']}))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/css'));
});

// compiles sass from scss/main.scss to main.css
// adds prefixes with auto prefixer to css
// minifies css to main.min.css
// writes source maps
// places both in dist/css
gulp.task('minifyCss', function() {
	return gulp.src('scss/main.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({browsers:['last 2 versions']}))
		.pipe(cssnano())
		.pipe(rename("main.min.css"))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream());
});

// starts development server at localhost:3000
// watches html, js, and scss and runs associated tasks
gulp.task('watchFiles',['build'], function() {
	browserSync.init({
        server: "./"
    });
	gulp.watch('scss/**/*.scss', ['minifyCss']);
	gulp.watch('js/assets/**/*.js', ['minifyScripts']);
	gulp.watch('./*.html', ['htmlReload']);
});

// builds the dist directory and by running associated tasks
// that place their contents in dist, and by placing the folders and 
// files returned from gulp.src into dist 
gulp.task('build', ['minifyHTML', 'minifyScripts', 'minifyCss','compileSass','concatScripts'], function() {
	return gulp.src(["img/**",
					'./*.html',
					'./js/*.min.js',
					'./js/*.min.js.map',
					'./css/*.min.css',
					'./css/*.min.css.map'],
					 { base: './'})
			.pipe(gulp.dest('dist'));
});

// deletes all folders created by gulp tasks
gulp.task('clean', function(){
	del(['dist','js/app*.js*','css/main*.css*']);
});

// default task is set to start the watch listeners
gulp.task('default', [], function() {
	gulp.start(['watchFiles']);
});

