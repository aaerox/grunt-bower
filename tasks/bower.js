/*
 * grunt-bower
 * https://github.com/curist/grunt-bower
 *
 * Copyright (c) 2012 curist
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================
  var task_desc = 'Copy bower installed components to dist folder.'
    , _ = grunt.utils._
    , path = require('path')
    , bower = require('bower')
    , log = grunt.log.write
    , helpers = require('./lib/helpers').init(grunt);

  grunt.registerMultiTask('bower', task_desc, function() {
    var done = this.async()
      , dest = this.file.dest || path.join('public', 'scripts' ,'vendor')
      , options = this.data.options || {}
      , base_path = options.basePath;

    bower.commands.list({"paths":true})
      .on('data',  function (data) {
        _(data).each(function(src_path, lib_name) {
          var preserved_path
            , dest_file_path;

          if(base_path !== undefined) {
            preserved_path = helpers.strippedBasePath(base_path, src_path);
          } else {
            preserved_path = '';
          }

          dest_file_path = path.join(dest, preserved_path, (lib_name + '.js'));

          try {
            grunt.file.copy(src_path, dest_file_path);
            log(src_path.cyan + ' copied.\n');
          } catch (err) {
            grunt.fail.warn(err);
          }
        });
        done();
      })
      .on('error', function (err) {
        grunt.fail.warn(err);
      });
  });

  // alias
  grunt.registerTask('bower:copy', 'bower');

  // bower command wrapper
  // basically copied from Yeoman's bower task
  function bower_wrapper(cmd, done) {
    // pull in the bower command module
    var command = bower.commands[cmd];

    // run
    command.line(process.argv)
      .on('error', grunt.fatal.bind(grunt.fail))
      .on('data', grunt.log.writeln.bind(grunt.log))
      .on('end', function(){
        done();
      });
  }

  // register bower commands as grunt tasks
  Object.keys(bower.commands).forEach(function(cmd) {
    var task_name = 'bower:' + cmd
      , task_desc = 'wrapped bower ' + cmd + 'command.';

    grunt.registerTask(task_name, task_desc, function() {
      var done = this.async();
      bower_wrapper(cmd, done);
    });
  });
};
