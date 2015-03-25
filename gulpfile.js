var gulp = require('gulp'),
  gutil = require('gulp-util'),
  glob = require('glob'),
  path = require('path'),
  browserify = require('browserify'),
  sourcemaps = require('gulp-sourcemaps'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  watchify = require('watchify'),
  reactify = require('reactify'),
  nodemon = require('gulp-nodemon'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

gulp.task('default', ['html', 'bundle', 'nodemon']);

var PATHS = {
  plugins: __dirname + '/plugins/*',
  src: __dirname + '/plugins/*/src',
  dist: __dirname + '/plugins/*/dist'
}

gulp.task('bundle', function () {
  glob.sync(PATHS.src + '/app.js').forEach(bundler);
});

// Compile JSX into JS
function bundler(file) {
  var watchArgs = watchify.args;
  watchArgs.transform = [reactify];
  var Bundler = watchify(browserify(watchArgs));
  var pluginRoot = path.dirname(file) + '/..';
  Bundler.add(file);

  function bundle() {
    console.log('Bundling: ' + file);
    return Bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest(pluginRoot + '/dist'));
  };
  Bundler.on('update', bundle);
  bundle();
}

gulp.task('html', function () {
  glob.sync(PATHS.src + '/*.html').forEach(html);
});

// Copy an HTML file into /dist
function html(file) {
  var pluginRoot = path.dirname(file) + '/..';
  gulp.src(file)
    .pipe(gulp.dest(pluginRoot + '/dist'));
}

gulp.task('uglify', function () {
  glob.sync(PATHS.dist + '/app.js').forEach(min);
});

// Uglify/min a .js file
function min(file) {
  var pluginRoot = path.dirname(file) + '/..';
  gulp.src(file)
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(pluginRoot + '/dist'));
}

gulp.task('nodemon', function () {
  // watch for new HTMLs and publish them
  gulp.watch(PATHS.src + '/*.html', function (ev) {
    html(ev.path);
  });

  // watch for new dist/app.js and min them
  gulp.watch(PATHS.dist + '/app.js', function(ev) {
    min(ev.path);
  });

  // start the server
  nodemon({
    env: process.ENV,
    script: 'index.js',
    args: process.argv.slice(2),
    watch: [
      'index.js',
      PATHS.plugins + '/index.js',
      PATHS.dist + '/*.html',
      'plugins/*/routes/*.js',
      'plugins/*/controllers/*.js'
    ]
  });
});
