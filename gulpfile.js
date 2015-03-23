var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');

gulp.task('default', function() {
  nodemon({
    script: 'index.js',
    args: process.argv.slice(2),
    ext: 'html js',
    ignore: [
      'plugins/ui/bower_components/*',
      '*/node_modules/*'
    ]
  });
});
