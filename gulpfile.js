// Gulpfile.js
// Check required packages
const gulp = require("gulp");
const rename = require("gulp-rename");
// CSS compiling
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
// Browsersync
// const browserSync = require('browser-sync').create();

function style() {
  return (
    gulp
      .src("styles/scss/style.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest("public/"))
      // .pipe(browserSync.stream())
      .pipe(cleanCSS({ compatibility: "ie9", debug: true }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest("public/"))
  );
}

function watch() {
  // browserSync.init({
  //     server: {
  //         baseDir: './'
  //     },
  //     open: false
  // });
  gulp.watch("styles/scss/**/*.scss", style);
  // gulp.watch('./*.html').on('change', browserSync.reload);
  // gulp.watch('./**/*.js').on('change', browserSync.reload);
}

gulp.task("build", style);

exports.style = style;
exports.default = watch;
