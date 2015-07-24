var gulp = require('gulp'), // Gulp
    jshint = require('gulp-jshint'), // JSHint
    jshint_stylish = require('jshint-stylish'), // Make the JSHint pretty
    concat = require('gulp-concat'), // Concatinate piped files
    bower = require('main-bower-files'), // Grabs main bower files so we can compile them
    liveReload = require('gulp-livereload'), // Live Reload Plugin
    gulpFilter = require('gulp-filter'), // Build Gulp file filters
    nodemon = require('gulp-nodemon'), // Run Nodemon
    sass = require('gulp-sass'),
    del = require('del'); // Delete files

// Root Paths for file manipulation
var rootPaths = {
    source: 'src',
    dest: 'public',
    bower: 'bower_components',
    server: 'server',
    foundation: 'bower_components/foundation'
};

// Locations of source files
var sources = {
    js: rootPaths.source + '/js/**/*.js',
    scss: rootPaths.source + '/scss/**/*.scss',
    scssMaster: rootPaths.source + '/scss/app.scss',
    html: rootPaths.source + '/html/**/*.html',
    server: rootPaths.server + '/**/*.js',
    vendorCopy: [rootPaths.bower + '/modernizr/modernizr.js']
};

// Locations of destination (built) files
var dest = {
    js: rootPaths.dest + '/js',
    css: rootPaths.dest + '/css',
    html: rootPaths.dest + '/html',

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

// Compile all Sass files
gulp.task('compileSass', function(){
    return gulp.src(sources.scssMaster)
        .pipe(sass())
        .pipe(concat(dest.fileNames.srcCss))
        .pipe(gulp.dest(dest.css))
        .pipe(liveReload());
});

// Lint JS
gulp.task('lintJs', function(){
    return gulp.src(sources.js)
        .pipe(jshint())
        .pipe(jshint.reporter(jshint_stylish));
});

// Lint Server
gulp.task('lintServer', function(){
    return gulp.src(sources.server)
        .pipe(jshint())
        .pipe(jshint.reporter(jshint_stylish));
});

// Compile all HTML
gulp.task('compileHtml', function(){
    return gulp.src(sources.html)
        .pipe(gulp.dest(dest.html))
        .pipe(liveReload());
});

// Compiles all Bower JS and CSS files into vendor.js/vendor.css
gulp.task('compileBower', function(){
    // Ignore foundation JS (this gets compiled in a different task) and ignore Modernizr as it needs to be
    // loaded separately in the <head> tag
    var jsFilter = gulpFilter(['**/*.js', '!foundation/**/*', '!modernizr/**/*']);
    var cssFilter = gulpFilter(['**/*.css', '!foundation/**/*']);

    return gulp.src(bower(), {base: rootPaths.bower})
        // Compile JS
        .pipe(jsFilter)
        .pipe(concat(dest.fileNames.vendorJs))
        .pipe(gulp.dest(dest.js))
        .pipe(jsFilter.restore())
        // Compile CSS
        .pipe(cssFilter)
        .pipe(concat(dest.fileNames.vendorCss))
        .pipe(gulp.dest(dest.css))
        .pipe(cssFilter.restore())
        .pipe(liveReload());
});

// Copy modernizr to public/js. This needs to be separate from Vendor because it needs to be loaded in the <head> tag.
gulp.task('copyVendor', function(){
   return gulp.src(sources.vendorCopy)
       .pipe(gulp.dest(dest.js));
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
        dest.html
    ]);
});

// Watches source files for automatic build/reload
gulp.task('watch', function(){
    liveReload.listen();

    gulp.watch(sources.js, ['lintJs', 'compileJs']);
    gulp.watch(sources.server, ['lintServer']);
    gulp.watch(sources.html, ['compileHtml']);
    gulp.watch(sources.scss, ['compileSass']);
    // Removing this for now - it keeps triggering when it shouldn't
    //gulp.watch(rootPaths.bower, ['compileBower']);
    gulp.watch(sources.vendorCopy, ['copyVendor']);
});

// Lint Server and Source JS
gulp.task('lintAll', ['lintJs', 'lintServer']);

// Clean, Lint, and Compile everything
gulp.task('compile', ['clean', 'lintAll', 'copyVendor', 'compileJs', 'compileSass', 'compileHtml', 'compileBower']);

// Compile and Watch
gulp.task('compile:watch', ['compile', 'watch']);
gulp.task('compile-watch', ['compile:watch']);

// Compile, Start Server and Watch
gulp.task('full', ['compile', 'server', 'watch']);

// DEFAULT: Compile, Start Server and Watch
gulp.task('default', ['full']);