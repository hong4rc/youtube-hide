const fs = require('fs');

const gulp = require('gulp');
const terser = require('gulp-terser');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const zip = require('gulp-zip');
const capitalize = require('capitalize');
const log = require('fancy-log');

const pkg = require('./package.json');

const dev = (cb) => {
  process.env.NODE_ENV = 'dev';
  cb();
};
const prod = (cb) => {
  process.env.NODE_ENV = 'prod';
  cb();
};

const del = () => gulp
  .src('build', { read: false, allowEmpty: true }).pipe(clean());

const manifestTask = (cb) => {
  const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));
  manifest.name = capitalize.words(pkg.name.replace(/-/g, ' '));
  manifest.version = pkg.version;
  manifest.description = pkg.description;
  fs.writeFileSync('./build/manifest.json', JSON.stringify(manifest, null, 2));
  cb();
};

const js = () => {
  let src = gulp.src([
    './src/js/you-tube/key-master.js',
    './src/js/you-tube/you-tube.js',
  ]).pipe(concat('you-tube.js'));
  if (process.env.NODE_ENV === 'prod') {
    log('Build production');
    src = src.pipe(terser());
  }
  return src.pipe(gulp.dest('./build/js'));
};

const dest = () => gulp.src('build/**/*')
  .pipe(zip(`${pkg.name}-${pkg.version}.zip`))
  .pipe(gulp.dest('dist'));

const build = gulp.series(del, js, manifestTask);

const buildDev = gulp.series(dev, build);
const buildProd = gulp.series(prod, build, dest);

const watch = () => {
  buildDev();
  log('--- Build done, Watching src/js/ ---');
  gulp.watch('src/**/**/*', buildDev);
};

module.exports = {
  build,
  watch,
  buildDev,
  buildProd,
};
