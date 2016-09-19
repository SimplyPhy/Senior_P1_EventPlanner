var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    cleanCSS    = require('gulp-clean-css'),
    autoPrefix  = require('gulp-autoprefixer');

gulp.task('concatScripts', function() {
  return gulp.src([
      'js/jquery.min.js',
      'js/jquery-ui.min.js',
      'js/maskedInput.js',
      'js/main.js'
    ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src('js/app.js')
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
  return gulp.src('scss/app.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(autoPrefix({browsers: ['last 2 versions']}))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

gulp.task('concatCSS', ['compileSass'], function() {
  return gulp.src([
      'css/reset.css',
      'css/jquery-ui.min.css',
      'css/app.css'
    ])
    .pipe(concat('app.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('cleanCSS', ['concatCSS'], function() {
  return gulp.src('css/app.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('css'));
});

gulp.task('watchFiles', ['browser-sync'], function() {

  gulp.watch('scss/**/*', ['cleanCSS']).on('change', browserSync.reload);
  gulp.watch('js/*', ['concatScripts']).on('change', browserSync.reload);
  gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('clean', function() {
  del(['dist', 'css/app.css*', 'js/app*.js*']);
});

gulp.task('browser-sync', function() {
  var files = [
    'index.html',
    'css/**/*.css',
    'js/**/*.js',
    'sass/**/*.scss'
  ];

  browserSync.init({
    server: {
      baseDir: "./",
    },
    browser: "google chrome",
    injectChanges: true
  });
});

gulp.task('build', ['minifyScripts', 'cleanCSS'], function() {
  return gulp.src(["css/app.css", "js/app.min.js", "index.html",
    "img/**", "fonts/**"], {base: './'})
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function() {
  gulp.start('build');
});