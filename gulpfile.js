const gulp = require('gulp');

var pug = require('gulp-pug');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var flatten = require('gulp-flatten')

// Development Tasks

// Transpile pug files to html, flatten file path 
gulp.task('views', function buildHTML() {
  return gulp.src('app/views/**/!(_)*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(flatten())
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Transpile sass files
gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Spinn up a http server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});

//Watch files when they are saved then reload server
gulp.task('watch', ['browserSync', 'views', 'sass'], function() {
  gulp.watch('app/views/**/*.pug', ['views']);
  gulp.watch('app/sass/**/*.sass', ['sass']);
  //Reload the browser whenever HTML or JS files change
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/img/**/*', browserSync.reload);
  gulp.watch('app/fonts/**/*', browserSync.reload);
});

//Default gulp command
gulp.task('default', function(callback) {
  runSequence(['views', 'sass', 'browserSync', 'watch'], callback)
});


// Build Tasks

//Concatenate, minify JS and CSS files
gulp.task('useref', function() {
  return gulp.src('app/*.html')
    //Concatenate files
    .pipe(useref())
    //Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    //Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});


//Images
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
    //caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
});

//Copy fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

//Copy favicon
gulp.task('favicons', function() {
  return gulp.src('app/favicons/*')
    .pipe(gulp.dest('dist'))
});

//Clean dist folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

//Clean cache if you need
// gulp.task('cache:clear', function(callback) {
//   return cache.clearAll(callback)
// });

//Build the Project
gulp.task('build', function(callback) {
  runSequence('clean:dist', 'sass', 'useref', 'images', 'fonts', 'favicons',
    callback
  )
});
