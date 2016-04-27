/* Example theme Gulp file. */
'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    pckg = require('./package.json'),
    connect = require('gulp-connect');

var project_name = pckg.name;

/**
 * Task to rebuild CSS files.
 */
gulp.task('build-css', function() {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(concat(project_name + '.min.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps', {
      addComment: false,
      includeContent: false
    }))
    .pipe(replace('font-path("bootstrap/glyphicons-halflings', '"../../bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings'))
    .pipe(replace('"))', '")'))
    .pipe(gulp.dest('./assets/css'));
});

/**
 * Setup jshint, look at JS files which aren't minified.
 */
gulp.task('jshint', function() {
  return gulp.src(['./assets/js/*.js', '!./assets/js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Build the JS files into one, minified named file with sourcemaps.
 */
gulp.task('build-js', function() {
  return gulp.src(['./assets/js/*.js', '!./assets/js/*.min.js'])
    .pipe(sourcemaps.init())
    .pipe(concat(project_name + '.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps', {
      addComment: false,
      includeContent: false
    }))
    .pipe(gulp.dest('./assets/js/'));
});

/**
 * Watch the files for changes, run code checks and compile SCSS.
 */
gulp.task('watch', function() {
  gutil.log('Gulp is watching for changes...');

  gulp.watch(['./assets/scss/*.scss', './assets/scss/**/*.scss'], ['build-css']);
  gulp.watch(['./assets/js/*.js', '!./assets/js/*.min.js'], ['jshint', 'build-js']);
});

/**
 * Set up a webserver for local development.
 */
gulp.task('webserver', function() {
  connect.server({
    port: 6789
  });
});

/**
 * Add the default task which follows after watch.
 */
gulp.task('default', ['watch', 'webserver']);
