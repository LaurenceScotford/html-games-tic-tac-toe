const { src, dest, watch, series, parallel } = require('gulp');
const connect = require('gulp-connect');
const del = require('del');

function clean(cb) {
  return del(['dist']);
  cb();
}

function cleanCss(cb) {
  return del(['dist/css']);
  cb();
}

function buildCss() {
  return src('src/css/*')
    .pipe(dest('dist/css'))
    .pipe(connect.reload());
}

function cleanJs(cb) {
  return del(['dist/js']);
  cb();
}

function buildJs() {
  return src('src/js/*')
    .pipe(dest('dist/js'))
    .pipe(connect.reload());
}

function cleanHtml(cb) {
  return del(['dist/*.html']);
  cb();
}

function buildHtml() {
  return src('src/*.html')
    .pipe(dest('dist'))
    .pipe(connect.reload());
}

function serve(cb) {
  connect.server({
    root: 'dist',
    livereload: true
  }, function() {
    this.server.on('close', cb)
  });
}

function watcher(cb) {
  watch('src/css/*', series(cleanCss, buildCss));
  watch('src/js/*', series(cleanJs, buildJs));
  watch('src/*.html', series(cleanHtml, buildHtml));
  cb();
}

exports.clean = series(clean);
exports.serve = series(serve);
exports.build = series(clean, buildCss, buildJs, buildHtml);
exports.default = parallel(serve, series(clean, buildCss, buildJs, buildHtml, watcher));
