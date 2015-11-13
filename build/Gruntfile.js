module.exports = function( grunt )
{
var root = '../';
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
                src: [ root + 'scripts/*.ts' ],
                dest: 'temp/code.js',
                options: {
                    sourceMap: false
                }
            }
        },

            // copy the audio and libraries files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: [
                    'audio/*.{mp3,ogg}',
                    'libraries/*.js'
                ],
                dest: dest
            }
        },

        uglify: {
            release: {
                files: [{
                    src: 'temp/code.js',
                    dest: dest + 'min.js'
                }]
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: root,
                    src: 'style.css',
                    dest: dest
                }]
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: root,
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