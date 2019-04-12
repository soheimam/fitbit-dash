const gulp = require("gulp");
const ts = require("gulp-typescript");
const gutil = require("gulp-util");
const browserify = require('browserify');
const watchify = require('watchify')
const tsify = require("tsify");
const source = require('vinyl-source-stream');

const cleanCss = require("gulp-clean-css");
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
//const autoprefixer = require('autoprefixer');
//const concat = require('concat');


const paths = {
    pages: ['src/*.html']
};

gulp.task("css",function(){
    return gulp.src([
        "src/css/reset.css",
        "src/css/app.css"
    ])
        .pipe(sourcemaps.init())
        .pipe(postcss([
            require('autoprefixer'),
            require('postcss-preset-env')({
                stage:1,
                browsers: ["IE 11", 'last 2 versions']
            })
        ]))
        
        .pipe(
            cleanCss({
                compatibility: "ie8"
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
});


const watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html",'css'], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);