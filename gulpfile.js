/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var browserify = require('browserify');
var reactify = require('reactify');
var jshintify = require('jshintify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var react = require("gulp-react");

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('assets/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe(react())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src('assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('public/images'))
    .pipe($.size({title: 'images'}));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  return gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('public'))
    .pipe($.size({title: 'copy'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(['assets/fonts/**'])
    .pipe(gulp.dest('public/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Copy scripts to dist
gulp.task('scripts', function () {
  return gulp.src(['assets/scripts/**'])
    .pipe(gulp.dest('public/scripts'))
    .pipe($.size({title: 'scripts'}));
});


// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'assets/styles/*.scss',
    'assets/styles/**/*.css',
    'assets/styles/components/components.scss'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.changed('.tmp/styles', {extension: '.css'}))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('public/styles'))
    .pipe($.size({title: 'styles'}));
});


// Scan your HTML for assets & optimize them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('assets/**/*.html')
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Remove any unused CSS
    // Note: if not using the Style Guide, you can delete it from
    //       the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'assets/index.html',
        'assets/styleguide.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: [
        /.navdrawer-container.open/,
        /.app-bar.open/
      ]
    })))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Update production Style Guide paths
    .pipe($.replace('components/components.css', 'components/main.min.css'))
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'public/*', '!public/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['styles'], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'asset']
  });

  gulp.watch(['asset/**/*.html'], reload);
  gulp.watch(['asset/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['asset/scripts/**/*.js'], ['jshint']);
  gulp.watch(['asset/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:public', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'public'
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint', 'html', 'images', 'fonts', 'scripts', 'copy', 'todo'], cb);
});

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }


gulp.task('todo', ['angularjs', 'reactjs', 'vuejs'], function () {

});

gulp.task('angularjs', function () {
  return gulp.src([
    'bower_components/todomvc-common/base.css',
    'bower_components/todomvc-common/base.js',
    'bower_components/todomvc-app-css/index.css',
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-resource/angular-resource.js',
    'assets/scripts/angularjs/**/*'
  ], {
    dot: true
  }).pipe(gulp.dest('public/angularjs'))
    .pipe($.size({title: 'copy-angularjs'}));
});


gulp.task('reactjs-copy', function () {
  return gulp.src([
    'bower_components/todomvc-common/base.css',
    'bower_components/todomvc-app-css/index.css',
    'bower_components/todomvc-common/base.js'
  ], {
    dot: true
  }).pipe(gulp.dest('public/reactjs'))
    .pipe($.size({title: 'copy-reactjs'}));
});

gulp.task('reactjs', ['reactjs-copy'], function () {
  return browserify({
    entries: ['assets/scripts/reactjs/app.js'],
    extensions: ['.jsx', '.js'], // .jsx is for React.js templates
    debug: true // used by React.js
  })
    .transform(reactify) // react.js browserify transform
    .transform(jshintify) // jshint browserify transform
    .bundle() // bundle modules
    .pipe(source('bundle.min.js')) // filename to save as
    .pipe(buffer()) // stream => buffer
    //.pipe(uglify()) // minify js
    .pipe(gulp.dest('public/reactjs')) // save to output directory
    .pipe($.size({title: 'build-reactjs'}));
});

gulp.task('vuejs', function () {
  return gulp.src([
    'bower_components/todomvc-common/base.css',
    'bower_components/todomvc-app-css/index.css',
    'bower_components/todomvc-common/base.js',
    'bower_components/director/build/director.js',
    'bower_components/vue/dist/vue.js',
    'bower_components/vue-resource/dist/vue-resource.js',
    'assets/scripts/vuejs/**/*'
  ], {
    dot: true
  }).pipe(gulp.dest('public/vuejs'))
    .pipe($.size({title: 'copy-vuejs'}));
});