module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        files: {
          "public/stylesheet/app.css": "public/less/app.less"
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less']);
};
