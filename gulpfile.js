var gulp = require('gulp'), // Gulp
    jshint = require('gulp-jshint'), // JSHint
    jshint_stylish = require('jshint-stylish'), // Make the JSHint pretty
    concat = require('gulp-concat'), // Concatinate piped files
    bower = require('main-bower-files'), // Grabs main bower files so we can compile them
    liveReload = require('gulp-livereload'), // Live Reload Plugin
    gulpFilter = require('gulp-filter'), // Build Gulp file filters
    nodemon = require('gulp-nodemon'), // Run Nodemon
    del = require('del'); // Delete files

// Root Paths for file manipulation
const rootPaths = {
    source: 'src',
    dest: 'public',
    bower: 'bower_components'
};

// Locations of source files
const sources = {
    js: rootPaths.source + '/js/**/*.js',
    css: rootPaths.source + '/css/**/*.css',
    views: rootPaths.source + '/views/**/*.html'
};

// Locations of destination (built) files
const dest = {
    js: rootPaths.dest + '/js',
    css: rootPaths.dest + '/css',
    views: rootPaths.dest + '/views',

    fileNames: {
        srcJs: 'marriott-breaks.js',
        srcCss: 'marriott-breaks.css',
        vendorJs: 'vendor.js',
        vendorCss: 'vendor.css'
    }
};

// Compile all JS
gulp.task('compileJs', function(){
    return gulp.src(sources.js)
        .pipe(concat(dest.fileNames.srcJs))
        .pipe(gulp.dest(dest.js))
        .pipe(liveReload());
});

// Compile all CSS
gulp.task('compileCss', function(){
    return gulp.src(sources.css)
        .pipe(concat(dest.fileNames.srcCss))
        .pipe(gulp.dest(dest.css))
        .pipe(liveReload());
});

// Lint JS
gulp.task('lint', function(){
    return gulp.src(sources.js)
        .pipe(jshint())
        .pipe(jshint.reporter(jshint_stylish));
});

// Compile all Views
gulp.task('compileViews', function(){
    return gulp.src(sources.views)
        .pipe(gulp.dest(dest.views))
        .pipe(liveReload());
});

// Compiles all Bower JS and CSS files into vendor.js/vendor.css
gulp.task('compileBower', function(){
    var jsFilter = gulpFilter('**/*.js');
    var cssFilter = gulpFilter('**/*.css');

    return gulp.src(bower(), {base: rootPaths.bower})
        .pipe(jsFilter)
        .pipe(concat(dest.fileNames.vendorJs))
        .pipe(gulp.dest(dest.js))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(concat(dest.fileNames.vendorCss))
        .pipe(gulp.dest(dest.css))
        .pipe(cssFilter.restore())
        .pipe(liveReload());
});


// Starts the node server using nodemon
gulp.task('server', function(){
    nodemon({
        script: 'server/server.js'
    })
    .on('restart', function(){
        liveReload.reload();
    });
});

// Deletes all existing build files
gulp.task('clean', function(){
    del.sync([
        dest.js,
        dest.css,
        dest.views
    ]);
});

// Watches source files for automatic build/reload
gulp.task('watch', function(){
    liveReload.listen();

    gulp.watch(sources.js, ['lint', 'compileJs']);
    gulp.watch(sources.views, ['compileViews']);
    gulp.watch(sources.css, ['compileCss']);
    gulp.watch(rootPaths.bower, ['compileBower']);
});

// Clean, Lint, and Compile everything
gulp.task('compile', ['clean', 'lint', 'compileJs', 'compileCss', 'compileViews', 'compileBower']);

// Compile and Watch
gulp.task('compile:watch', ['compile', 'watch']);
gulp.task('compile-watch', ['compile:watch']);

// Compile, Start Server and Watch
gulp.task('full', ['compile', 'server', 'watch']);

// DEFAULT: Compile, Start Server and Watch
gulp.task('default', ['full']);