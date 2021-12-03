const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const webp = require('gulp-webp');
const del = require('del');
const gulpWebp = require('gulp-webp');
const rename = require('gulp-rename');
const filelist = require('gulp-filelist');
const path = require('path');
const jsdoc = require('gulp-jsdoc3');
const zip = require('gulp-zip');

const PROJECT_TECH_NAME = 'rnd-npcs';

async function buildCSS() {
  return src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat(`${PROJECT_TECH_NAME}.css`))
    .pipe(cleanCSS())
    .pipe(dest('./build'));
};

async function copyImages()
{
  return src(['./src/img/**/*.png', './src/img/**/*.jpg', './src/img/**/*.tiff'])
    .pipe(webp({quality: 90, alphaQuality: 100, method: 6, metadata: 'icc'}))
    .pipe(dest('./build/assets/img'));
}

async function copyStatic()
{
  return src('./src/static/**')
    .pipe(dest('./build'));
}

async function clean()
{
  return del(['build/**', '!build']);
}

async function buildTemplateList()
{
  return src('./src/static/templates/**/*.hbs')
    .pipe(rename(filePath => filePath.dirname = path.join(`modules/${PROJECT_TECH_NAME}/templates`, filePath.dirname)))
    .pipe(filelist('templateList.json', { relative: true }))
    .pipe(dest('build/data'));
}

async function buildDocumentation()
{
  const config = require('./jsdoc.json');
  return src(['README.md', './src/static/module/**/*.js'], {read: false})
    .pipe(jsdoc(config));
}

async function zipBuild()
{
  return src('./build/**')
    .pipe(zip(`${PROJECT_TECH_NAME}.zip`))
    .pipe(dest('dists'));
}

async function buildWatch()
{
  watch('src/styles/**/*.scss', { ignoreInitial: false }, buildCSS);
  watch('src/img/**', { ignoreInitial: false }, copyImages);
  watch('src/static/**', { ignoreInitial: false }, copyStatic);
  watch('./src/static/templates/**/*.hbs', { ignoreInitial: false }, buildTemplateList);
  watch(['README.md', './src/static/module/**/*.js'], {ignoreInitial: false}, buildDocumentation);
}

exports.build = series(clean, parallel(buildCSS, copyImages, copyStatic, buildTemplateList, buildDocumentation));
exports.buildWatch = series(clean, buildWatch);

exports.zipbuild = series(zipBuild);
