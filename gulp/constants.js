// Root Paths for file manipulation
var rootPaths = {
    source: 'src',
    dest: 'public',
    bower: 'bower_components',
    server: 'server'
};

// Locations of source files
var sources = {
    js: rootPaths.source + '/js/**/*.js',
    scss: rootPaths.source + '/scss/**/*.scss',
    scssMaster: rootPaths.source + '/scss/app.scss',
    scssMap: rootPaths.source + '/scss/layout/map.scss',
    html: rootPaths.source + '/html/**/*.html',
    index: rootPaths.source + '/html/index.html',
    assets: rootPaths.source + '/assets/**/*',
    server: rootPaths.server + '/**/*.js',
    vendorCopy: [rootPaths.bower + '/modernizr/modernizr.js']
};

// Locations of destination (built) files
var dest = {
    js: rootPaths.dest + '/js',
    css: rootPaths.dest + '/css',
    html: rootPaths.dest + '/html',
    assets: rootPaths.dest + '/assets',

    fileNames: {
        srcJs: 'marriott-breaks.js',
        srcCss: 'marriott-breaks.css',
        vendorJs: 'vendor.js',
        vendorCss: 'vendor.css'
    }
};

module.exports = {
    rootPaths: rootPaths,
    sources: sources,
    dest: dest
};