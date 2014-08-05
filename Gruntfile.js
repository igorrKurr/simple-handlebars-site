module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      app: {
        src: ['app/js/**/*.js'],
        dest: 'build/app.js'
      },
      assets: {
        src: ['vendor/jquery/dist/jquery.min.js','vendor/handlebars/handlebars.runtime.min.js'],
        dest: 'build/assets/assets.js'
      },
      test: {
        src: ['<%= concat.assets.dest%>', 'build/templates.js', '<%= concat.app.dest%>', ],
        dest: 'test/app.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'build/app.min.js': ['<%= concat.app.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'app/js/**/*.js', 'test/**/*.js', '!test/app.js'],
    },
    watch: {
      all: {
        files: ['<%= jshint.files %>', 'app/index.html'],
        tasks: 'build',
        options: {
          livereload: true
        }
      }
    },
    express: {
      all:{
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          bases: 'build',
          livereload: true
        }
      }
    },
    open: {
      all: {
          path: 'http://localhost:<%= express.all.options.port %>'
      }
    },
    concat_css: {
      all: {
        src: ["app/styles/**/*.css"],
        dest: "build/app.css"
      },
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/index.html': 'app/index.html'
        }
      }
    },
    handlebars: {
      options: {
        namespace: 'LoT.Templates',
        processName: function(filePath) {
          return filePath.replace(/^app\/templates\//, '').replace(/\.hbs$/, '');
        }
      },
      all: {
        files: {
          "build/templates.js": ["app/templates/**/*.hbs"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.registerTask('test', ['jshint', 'concat', 'qunit']);
  grunt.registerTask('build', ['jshint', 'concat', 'handlebars', 'qunit','uglify', 'concat_css', 'htmlmin']);
  grunt.registerTask('serve', ['build', 'express','open', 'watch']);
  grunt.registerTask('default', ['jshint', 'concat','qunit', 'uglify', 'concat_css']);
};