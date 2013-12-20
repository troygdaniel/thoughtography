module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      // Your project's source files
      src : 'js/*.js',
      // Your Jasmine spec files
      specs : 'jasmine/*spec.js',
      // Your spec helper files
      helpers : 'jasmine/helpers/*.js'
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Default task.
  grunt.registerTask('default', 'jasmine');
};