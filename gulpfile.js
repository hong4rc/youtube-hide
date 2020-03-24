const fs = require('fs');

const gulp = require('gulp');
const terser = require('gulp-terser');
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const capitalize = require('capitalize');

const pkg = require('./package.json');
const manifest = require('./src/manifest.json');

process.env.NODE_ENV = true;
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
  manifest.name = capitalize.words(pkg.name.replace(/-/g, ' '));
  manifest.version = pkg.version;
  manifest.description = pkg.description;
  fs.writeFileSync('./build/manifest.json', JSON.stringify(manifest, null, 2));
  cb();
};

const js = () => {
  let src = gulp.src('./src/js/**.js');
  if (process.env.NODE_ENV === 'prod') {
    src = src.pipe(terser());
  }
  return src.pipe(gulp.dest('./build/js'));
};

const dest = () => gulp.src('src/*')
  .pipe(zip(`${pkg.name}-${pkg.version}.zip`))
  .pipe(gulp.dest('dist'));

const build = gulp.series(del, js, manifestTask);

const buildDev = gulp.series(dev, build);
const buildProd = gulp.series(prod, build, dest);

module.exports = {
  build,
  buildDev,
  buildProd,
};