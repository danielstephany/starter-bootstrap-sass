'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var minifyHTML = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

var scripts = [
		'bower_vendors/jquery/dist/jquery.min.js',
		'bower_vendors/jquery-touch-events/src/jquery.mobile-events.min.js',
		'bower_vendors/bootstrap-sass/assets/javascripts/bootstrap.js',
		'js/assets/main.js'];

gulp.task("htmlReload", function(){
	gulp.src('./*.html', { base: './'})
	.pipe(browserSync.stream());
});

gulp.task("minifyHTML", function(){
	return gulp.src('./*.html', { base: './'})
	.pipe(minifyHTML({collapseWhitespace: true}))
	.pipe(gulp.dest("./dist"))
	.pipe(browserSync.stream());
});

gulp.task('concatScripts', function() {
	return gulp.src(scripts)
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.stream());
});

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

gulp.task('compileSass', function() {
	return gulp.src('scss/main.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({browsers:['last 2 versions']}))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

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

gulp.task('watchFiles',['build'], function() {
	browserSync.init({
        server: "./"
    });
	gulp.watch('scss/**/*.scss', ['minifyCss']);
	gulp.watch('js/assets/**/*.js', ['minifyScripts']);
	gulp.watch('./*.html', ['htmlReload']);
});

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

gulp.task('clean', function(){
	del(['dist','js/app*.js*','css/main*.css*']);
});

gulp.task('default', [], function() {
	gulp.start(['watchFiles']);
});