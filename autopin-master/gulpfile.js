var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');

var paths = {
  js: 'src/**/*.js',
  dist: 'dist'
}

function runBabel(input, output) {
  return gulp.src(input)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(output));
}

gulp.task('dist', function() {
  return runBabel(paths.js, paths.dist);
});

gulp.task('watch', ['dist'], function() {
  gulp.watch('src/**/*.js', ['dist']);
});

gulp.task('default', ['dist']);
