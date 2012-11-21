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
  var task_name = 'bower'
    , task_desc = 'Copy bower installed components to dist folder.'
    , _ = grunt.utils._
    , path = require('path')
    , bower = require('bower')
    , log = grunt.log.write
    , helpers = require('./lib/helpers').init(grunt);

  grunt.registerMultiTask(task_name, task_desc, function() {
    var done = this.async()
      , dest = this.file.dest || path.join('public', 'scripts' ,'vendor')
      , options = this.data.options || {}
      , base_path = options.basePath;

    bower.commands.list({"paths":true})
      .on('data',  function (data) {
        _(data).each(function(src_path, lib_name) {
          var preserved_path
            , dest_file_path;

          // not sure if there is a standard for src_path or lib_name
          // and I don't know whether the current issue belongs to Bower
          // or other library authors
          if(!_(src_path).endsWith('.js')) {
            src_path += '.js';
          }

          if(!_(lib_name).endsWith('.js')) {
            lib_name += '.js';
          }

          if(base_path !== undefined) {
            preserved_path = helpers.strippedBasePath(base_path, src_path);
          } else {
            preserved_path = '';
          }

          dest_file_path = path.join(dest, preserved_path, (lib_name));

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
};
