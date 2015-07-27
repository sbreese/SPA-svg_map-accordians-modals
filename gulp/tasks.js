var gulp = require('gulp'), // Gulp
    constants = require('./constants'), // Gulp constants
    jshint = require('gulp-jshint'), // JSHint
    jshint_stylish = require('jshint-stylish'), // Make the JSHint pretty
    concat = require('gulp-concat'), // Concatinate piped files
    bower = require('main-bower-files'), // Grabs main bower files so we can compile them
    liveReload = require('gulp-livereload'), // Live Reload Plugin
    gulpFilter = require('gulp-filter'), // Build Gulp file filters
    nodemon = require('gulp-nodemon'), // Run Nodemon
    merge = require('merge-stream'), // Merge streams in one task
    sass = require('gulp-sass'),
    del = require('del'); // Delete files

// Compile all JS
gulp.task('compileJs', function(){
    return gulp.src(constants.sources.js)
        .pipe(concat(constants.dest.fileNames.srcJs))
        .pipe(gulp.dest(constants.dest.js))
        .pipe(liveReload());
});

// Compile all Sass files
gulp.task('compileSass', function(){
    return gulp.src(constants.sources.scssMaster)
        .pipe(sass())
        .pipe(concat(constants.dest.fileNames.srcCss))
        .pipe(gulp.dest(constants.dest.css))
        .pipe(liveReload());
});

// Lint JS
gulp.task('lintJs', function(){
    return gulp.src(constants.sources.js)
        .pipe(jshint())
        .pipe(jshint.reporter(jshint_stylish));
});

// Lint Server
gulp.task('lintServer', function(){
    return gulp.src(constants.sources.server)
        .pipe(jshint())
        .pipe(jshint.reporter(jshint_stylish));
});

// Compile all HTML
gulp.task('compileHtml', function(){
    // Compile all HTML except Index and place in public/views
    var html = gulp.src([constants.sources.html, '!' + constants.sources.index])
        .pipe(gulp.dest(constants.dest.html));

    // Copy Index to public root folder (separate from other HTML so it stays at the root folder)
    var index = gulp.src(constants.sources.index)
        .pipe(gulp.dest(constants.rootPaths.dest));

    return merge(html, index)
        .pipe(liveReload());
});

// Copy all images
gulp.task('copyImages', function(){
    return gulp.src(constants.sources.images)
        .pipe(gulp.dest(constants.dest.images))
        .pipe(liveReload());
});

// Compiles all Bower JS and CSS files into vendor.js/vendor.css
gulp.task('compileBower', function(){
    // Ignore foundation JS (we're using angular-foundation for the JS) and ignore Modernizr as it needs to be
    // loaded separately in the <head> tag
    var jsFilter = gulpFilter(['**/*.js', '!foundation/**/*', '!modernizr/**/*']);
    var cssFilter = gulpFilter(['**/*.css', '!foundation/**/*']);

    var concatPipe = gulp.src(bower(), {base: constants.rootPaths.bower})
        // Compile JS
        .pipe(jsFilter)
        .pipe(concat(constants.dest.fileNames.vendorJs))
        .pipe(gulp.dest(constants.dest.js))
        .pipe(jsFilter.restore())
        // Compile CSS
        .pipe(cssFilter)
        .pipe(concat(constants.dest.fileNames.vendorCss))
        .pipe(gulp.dest(constants.dest.css))
        .pipe(cssFilter.restore());

    var copyPipe = gulp.src(constants.sources.vendorCopy)
        .pipe(gulp.dest(constants.dest.js));

    return merge(concatPipe, copyPipe)
        .pipe(liveReload());
});

// Starts the node server using nodemon
gulp.task('server', function(){
    nodemon({
        script: 'server/server.js',
        ext: 'js',
        watch: ['server']
    })
        .on('restart', function(){
            setTimeout(function(){
                liveReload.reload();
            }, 500);
        });
});

// Deletes all existing build files
gulp.task('clean', function(){
    del.sync([constants.rootPaths.dest + '/**/*']);
});

// Watches source files for automatic build/reload
gulp.task('watch', function(){
    liveReload.listen();

    gulp.watch(constants.sources.js, ['lintJs', 'compileJs']);
    gulp.watch(constants.sources.server, ['lintServer']);
    gulp.watch(constants.sources.html, ['compileHtml']);
    gulp.watch(constants.sources.scss, ['compileSass']);
    gulp.watch(constants.sources.images, ['copyImages']);
    // Removing this for now - it keeps triggering when it shouldn't
    //gulp.watch(constants.rootPaths.bower, ['compileBower']);
});

// Lint Server and Source JS
gulp.task('lintAll', ['lintJs', 'lintServer']);

// Clean, Lint, and Compile everything
gulp.task('compile', [
        'clean',
        'lintAll',
        'compileJs',
        'compileSass',
        'compileHtml',
        'copyImages',
        'compileBower']
);

// Compile and Watch
gulp.task('compile:watch', ['compile', 'watch']);
gulp.task('compile-watch', ['compile:watch']);

// Compile, Start Server and Watch
gulp.task('full', ['compile', 'server', 'watch']);

// DEFAULT: Compile, Start Server and Watch
gulp.task('default', ['full']);