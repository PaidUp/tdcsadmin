// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/lodash/dist/lodash.compat.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/jquery-waypoints/waypoints.js',
      'client/bower_components/SHA-1/sha1.js',
      'client/bower_components/angulartics/src/angulartics.js',
      'client/bower_components/angulartics/src/angulartics-adobe.js',
      'client/bower_components/angulartics/src/angulartics-chartbeat.js',
      'client/bower_components/angulartics/src/angulartics-cnzz.js',
      'client/bower_components/angulartics/src/angulartics-flurry.js',
      'client/bower_components/angulartics/src/angulartics-ga-cordova.js',
      'client/bower_components/angulartics/src/angulartics-ga.js',
      'client/bower_components/angulartics/src/angulartics-gtm.js',
      'client/bower_components/angulartics/src/angulartics-kissmetrics.js',
      'client/bower_components/angulartics/src/angulartics-mixpanel.js',
      'client/bower_components/angulartics/src/angulartics-piwik.js',
      'client/bower_components/angulartics/src/angulartics-scroll.js',
      'client/bower_components/angulartics/src/angulartics-segmentio.js',
      'client/bower_components/angulartics/src/angulartics-splunk.js',
      'client/bower_components/angulartics/src/angulartics-woopra.js',
      'client/bower_components/angulartics/src/angulartics-marketo.js',
      'client/bower_components/angulartics/src/angulartics-intercom.js',
      'client/bower_components/moment/moment.js',
      'client/bower_components/angular-facebook/lib/angular-facebook.js',
      'client/bower_components/moment-range/lib/moment-range.js',
      'client/bower_components/angular-number-picker/angular-number-picker.js',
      'client/bower_components/angular-ui-utils/ui-utils.js',
      'client/app/app.js',
      'client/components/**/*.js',
      'client/app/**/*.js',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'html2js',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
