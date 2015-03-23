var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');

gulp.task('default', function() {
  nodemon({
    script: 'index.js',
    ext: 'html js',
    ignore: 'bower_components'
  });
});
