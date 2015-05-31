module.exports = function( grunt )
{
var dest = '../release/<%= pkg.name %>_<%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

            // delete the destination folder
        clean: {
            options: {
                force: true
            },
            release: [
                dest
            ]
        },

            // compile to javascript
        ts: {
            release: {
                src: [ '../scripts/*.ts' ]
            }
        },

            // copy the audio and libraries files
        copy: {
            release: {
                expand: true,
                cwd: '../',
                src: [
                    'audio/*.{mp3,ogg}',
                    'libraries/*.js'
                ],
                dest: dest
            }
        },

        uglify: {
            release: {
                files: {
                    '../release/<%= pkg.name %>_<%= pkg.version %>/min.js': [ '../scripts/*.js' ]
                }
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: '../',
                    src: 'style.css',
                    dest: dest
                }]
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: '../',
                    src: 'index.html',
                    dest: dest
                }]
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-processhtml' );
grunt.loadNpmTasks( 'grunt-ts' );

    // tasks
grunt.registerTask( 'default', [ 'clean', 'ts', 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};