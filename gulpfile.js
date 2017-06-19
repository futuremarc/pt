var gulp = require('gulp')
var gutil = require('gulp-util')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var replace = require('gulp-replace')
var wrap = require('gulp-wrap')
var concat = require('gulp-concat')
var minifyCSS = require('gulp-minify-css')
var stripDebug = require('gulp-strip-debug')
var uglify = require('gulp-uglify')
var declare = require('gulp-declare')
var handlebars = require('gulp-handlebars')
var autoprefix = require('gulp-autoprefixer')
var pug = require('gulp-pug');

var express = require('express');
var app = express();

if(app.get('env') === 'development'){
  var config = require('./config/config-dev');
} else {
  var config = require('./config/config');
}

gulp.task('default', ['watch']);

gulp.task('watch', function(){

  gulp.watch('source/scss/*.scss', ['build-css'])
  gulp.watch('views/handlebars/**/*.handlebars', ['precompile'])
  gulp.watch('source/js/auth/*.js',['auth-scripts'])
  gulp.watch('source/js/main/*.js', ['main-scripts'])

  //extension
  gulp.watch('source/scss/extension.scss', ['extension-build-css'])
  gulp.watch('source/js/extension/*.js', ['extension-scripts'])

})


gulp.task('socket-url-replace', function(){
  gulp.src(['public/js/local/*'],{base: "./"})
    .pipe(replace('http://localhost:5050',config.url))
    .pipe(gulp.dest("./"))
})

gulp.task('strip-minify', function(){
  gulp.src(['public/js/local/auth/*.js','public/js/local/main/*.js'],{base: "./"})
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest("./"))
})

gulp.task('build-css', function(){
  return gulp.src('source/scss/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css/local'))
})

gulp.task('auth-scripts', function(){
  gulp.src('source/js/auth/*.js')
    .pipe(gulp.dest('public/js/local/auth/'))
})

gulp.task('main-scripts', function(){
  gulp.src('source/js/main/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js/local/auth/'))
})

gulp.task('precompile', function(){

    gulp.src('views/handlebars/**/[^_]*.handlebars')
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Templates',
      noRedeclare: true,
      processName: function(filePath){
        return declare.processNameByPath(filePath.replace('views/handlebars/',''))
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('public/js/local/templates/'))
    .pipe(gulp.dest('extension/public/js/local/templates/'))
})


gulp.task('extension-build-css', function(){
  return gulp.src('source/scss/extension.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('extension/public/css/local/'))
})

gulp.task('extension-url-replace', function(){
  gulp.src(['extension/public/js/local/*', 'public/js/local/**/*'],{base: "./"})
    .pipe(replace('http://localhost:5050', config.url))
    .pipe(replace('http://localhost:8080', config.url))
    .pipe(gulp.dest("./"))
})


gulp.task('extension-scripts', function(){
  gulp.src('source/js/extension/**/*')
    .pipe(gulp.dest('extension/public/js/local/'))
    .pipe(gulp.dest('public/js/local/main'))
})