var paths = {
    sass: ['./scss/**/*.scss']
};

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    // uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    babel = require('gulp-babel');
//babel-preset-es2015


var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

gulp.task('clean', function(cb) {
    del([
        './www/js/bundle'
    ], cb);
});

gulp.task('sass', function(done) {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('build-js', function() {
    return gulp.src('./www/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(print())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat('bundle.js'))
        //   .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./www/bundle'));
});

gulp.task('build', ['clean', 'sass', 'build-js'], function() {
    return gulp.src('index.html')
        .pipe(cachebust.references())
});

gulp.task('watch', function() {
    return gulp.watch(['./index.html', './scss/*.*scss', './www/js/*.js'], ['build']);
});

gulp.task('default', ['build', 'watch'])