var gulp = require('gulp');
var manifest = require('gulp-manifest');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');

gulp.task('manifest', function () {
    gulp.src([
        'app/**/*.html',
        'app/**/bundle/**/*.js',
        'app/**/bundle/**/*.css',
        'app/**/img/**',
        'app/**/fonts/**'
    ])
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            network: ['*'],
            filename: 'app.appcache',
            exclude: ['app.appcache'],
            fallback: [
                '/ /index.html'
            ]
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('bundleLibJS', function () {
    gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-touch/angular-touch.min.js',
        'bower_components/angular-material/angular-material.min.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.min.js'
    ])
        .pipe(uglify({compress: false}))
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('app/bundle/js'))
});

gulp.task('bundleJS', function() {
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/bundle/js'))
});

gulp.task('bundleLibCSS', function () {
    gulp.src([
        'bower_components/angular-material/angular-material.css'
    ])
        .pipe(concatCss("lib.css"))
        .pipe(gulp.dest('app/bundle/css'))
});

gulp.task('bundleCSS', function () {
    gulp.src('app/css/*.css')
        .pipe(concatCss("app.css"))
        .pipe(gulp.dest('app/bundle/css'))
});

gulp.task('default', ['bundleJS', 'bundleLibJS', 'bundleCSS', 'bundleLibCSS', 'manifest'], function () {

});

