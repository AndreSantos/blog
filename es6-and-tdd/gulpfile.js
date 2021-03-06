/*global require:true */

var gulp = require('gulp');
var newer = require('gulp-newer');
var babel = require('gulp-babel');
var qunit = require('node-qunit-phantomjs');
var jshint = require('gulp-jshint');

var testFolder = 'tests';
var codeFolder = 'lib';
var dest = '/script/transpiled';
var files = '/script/es6/**/*.js';
var babelOptions = {modules: 'amd'};

var tests = {
	source: testFolder + files,
	destination: testFolder + dest
};

var code = {
	source: codeFolder + files,
	destination: codeFolder + dest
};

var transpile = function (paths) {
	return gulp.src(paths.source)
		.pipe(newer(paths.destination))
		.pipe(babel(babelOptions))
		.pipe(gulp.dest(paths.destination));
};

var lint = function (paths) {
	return gulp.src(paths.source)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
};

gulp.task('transpile tests', function () {
	return transpile(tests);
});

gulp.task('transpile source', function () {
	return transpile(code);
});

gulp.task('lint-tests', function () {
	return lint(tests);
});

gulp.task('lint-source', function () {
	return lint(code);
});

gulp.task('qunit', function () {
	qunit(testFolder + '/testrunner.html', { 'verbose': false });
});

gulp.task('watch', function () {
	gulp.watch(tests.source, ['transpile tests', 'lint-tests', 'qunit']);
	gulp.watch(code.source, ['transpile source', 'lint-source', 'qunit']);
});

gulp.task('default', 
	['transpile tests', 
	'transpile source', 
	'lint-tests', 
	'lint-source', 
	'qunit', 
	'watch']);