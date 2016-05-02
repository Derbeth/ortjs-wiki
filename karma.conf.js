module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'], // 'Firefox'
        reporters: ['spec', 'coverage'],

        files: [
            'node_modules/ort/dist/ort.js',
            'ort-button.js',
            'test/*.js'
        ],

        preprocessors: {
            'ort-button.js': ['coverage']
        }
    });
};
