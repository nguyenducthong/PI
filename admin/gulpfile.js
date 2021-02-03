/**
 * Created by dunghq on 26/8/2016.
 */
var gulp = require('gulp');
var minifyJS = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var deleteEmpty = require('delete-empty');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

/* Clean up the build folder */
gulp.task('clean:build', function () {
    return del.sync('build');
});

/* Compiling sass to css */
gulp.task('sass', function () {
    return gulp.src('src/app/assets/scss/*.+(scss|sass)')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('src/app/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/* Automatically sync resources change with browser */
gulp.task('browserSync', function () {
    browserSync.init({
        port: 3001,
        server: {
            baseDir: 'src/app'
        }
    })
});

/* Watch file changes and sync */
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('src/app/assets/scss/**/*.+(scss|sass)', ['sass']);
    gulp.watch(['src/**/*.html', '!src/app/assets/plugins/**/*.html'], browserSync.reload);
    gulp.watch(['src/**/*.css', '!src/app/assets/plugins/**/*.css'], browserSync.reload);
    gulp.watch(['src/**/*.js', '!src/app/assets/plugins/**/*.js'], browserSync.reload);
});

/* Minify js files */
gulp.task('minifyJs', function () {
    return gulp.src(['build/**/*.js', '!build/**/*.min.js', '!build/app/assets/plugins/**/*'])
        .pipe(minifyJS({preserveComments: 'license'}))
        .pipe(gulp.dest('build'));
});

/* Minify HTML files */
gulp.task('minifyHTML', function () {
   return gulp.src(['build/**/*.html', '!build/app/index.html', '!build/app/assets/**/*.html'])
       .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
       .pipe(gulp.dest('build'));
});

/* Compress/concatinate html and included js/css files */
gulp.task('useref', function () {
    return gulp.src(['src/app/index.html'])
        .pipe(useref())
        .pipe(gulpIf('*.js', minifyJS({preserveComments: 'license'})))
        .pipe(gulpIf('*.css', minifyCSS()))
        .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true, removeComments: true})))
        .pipe(gulp.dest('build/app'))
});

/* Copy all other files */
gulp.task('copyFiles', function () {
    return gulp.src([
            'src/**/*',
            '!src/app/assets/scripts/**/*',
            '!src/app/assets/scss/**/*',
            '!src/app/*.js',
            '!src/app/common/*.js',
            '!src/app/admin/*.js',
            '!src/app/member/*.js'
        ])
        .pipe(gulp.dest('build'));
});

/* Move useref's built files to inside build/app folder */
gulp.task('moveFiles', function () {
    return gulp.src(['build/assets/**/*'])
        // .pipe(vinylPaths(del))
        .pipe(gulp.dest('build/app/assets'));
});

/* Remove empty folders */
gulp.task('removeEmptyFolders', function () {
    deleteEmpty.sync('build/app');
});

/* Clear cache -- */
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

/* Default task to compile css and sync browser */
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});

/* Build the project */
gulp.task('build', function (callback) {
    runSequence('clean:build', 'sass',
        'copyFiles', 'useref', 'moveFiles', 'minifyJs', 'minifyHTML', 'removeEmptyFolders',
        callback
    )
});