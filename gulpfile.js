var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine');

function es6to5(input, output) {
  return gulp.src(input)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(output));
}

gulp.task('dist', ['lint'], function () {
  return es6to5('src/**/*.js', 'dist');
});

gulp.task('spec-dist', function () {
  return es6to5('spec/**/*.js', 'spec-dist');
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'spec/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint', 'dist', 'spec-dist'], function () {
  return gulp.src(['spec-dist/**/*.js'])
    .pipe(jasmine());
});
