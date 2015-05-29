/// <reference path="list.ts" />

window.onload = function()
{
Main.init();
};


module Main
{
var UNITS_NAMES = {
    baneling: { race: 'zerg' },
    broodlord: { race: 'zerg' },
    corruptor: { race: 'zerg' },
    drone: { race: 'zerg' },
    hydralisk: { race: 'zerg' },
    infestor: { race: 'zerg' },
    mutalisk: { race: 'zerg' },
    overlord: { race: 'zerg' },
    overseer: { race: 'zerg' },
    queen: { race: 'zerg' },
    roach: { race: 'zerg' },
    swarm_host: { race: 'zerg' },
    ultralisk: { race: 'zerg' },
    viper: { race: 'zerg' },
    zergling: { race: 'zerg' },

    archon: { race: 'protoss' },
    carrier: { race: 'protoss' },
    colossus: { race: 'protoss' },
    dark_templar: { race: 'protoss' },
    high_templar: { race: 'protoss' },
    immortal: { race: 'protoss' },
    mothership: { race: 'protoss' },
    observer: { race: 'protoss' },
    oracle: { race: 'protoss' },
    phoenix: { race: 'protoss' },
    probe: { race: 'protoss' },
    sentry: { race: 'protoss' },
    stalker: { race: 'protoss' },
    tempest: { race: 'protoss' },
    void_ray: { race: 'protoss' },
    warp_prism: { race: 'protoss' },
    zealot: { race: 'protoss' },

    banshee: { race: 'terran' },
    battlecruiser: { race: 'terran' },
    ghost: { race: 'terran' },
    hellbat: { race: 'terran' },
    hellion: { race: 'terran' },
    marauder: { race: 'terran' },
    marine: { race: 'terran' },
    medivac: { race: 'terran' },
    raven: { race: 'terran' },
    reaper: { race: 'terran' },
    scv: { race: 'terran' },
    siege_tank: { race: 'terran' },
    thor: { race: 'terran' },
    viking: { race: 'terran' },
    widow_mine: { race: 'terran' }
};


    // html elements
var MENU_UNITS_LEFT;
var MENU_TRIES_LEFT;
var AUDIO_ELEMENT;
var MESSAGE_ELEMENT;

    // game values
var CURRENT_UNIT = '';
var UNITS_LEFT = [];
var CURRENT_TRIES_LEFT = 3;

var MESSAGE_ID;
var LIST;


export function init()
    {
    initMenu();

    AUDIO_ELEMENT = document.querySelector( '#Audio' );
    MESSAGE_ELEMENT = document.querySelector( '#Message' );

    LIST = new List({
            units_info: UNITS_NAMES,
            container: document.body
        });
    UNITS_LEFT = Object.keys( UNITS_NAMES );

    getNextUnit();
    updateMenuValues();
    }


function initMenu()
    {
    MENU_UNITS_LEFT = document.querySelector( '#UnitsLeft' );
    MENU_TRIES_LEFT = document.querySelector( '#TriesLeft' );

    var search = document.querySelector( '#Search' );

    search.addEventListener( 'input', function( event )
        {
        LIST.search( event.srcElement.value );
        });
    }


export function guess( unitName: string )
    {
    if ( unitName === CURRENT_UNIT )
        {
        showMessage( 'Correct!', 'correct' );
        getNextUnit();
        }

    else
        {
        showMessage( 'Incorrect!', 'incorrect' );

        CURRENT_TRIES_LEFT--;
        updateMenuValues();

        if ( CURRENT_TRIES_LEFT < 0 )
            {
            gameOver();
            }
        }
    }


function getNextUnit()
    {
    var length = UNITS_LEFT.length;

    if ( length > 0 )
        {
            // random position
        var position = Math.floor( Math.random() * length );

        CURRENT_UNIT = UNITS_LEFT.splice( position, 1 )[ 0 ];

        var source = 'audio/' + CURRENT_UNIT + '.ogg';

        AUDIO_ELEMENT.src = source;
        AUDIO_ELEMENT.load();
        AUDIO_ELEMENT.play();
        }

        // game over
    else
        {
        showMessage( 'You Won!' );

        gameOver();
        }
    }


function gameOver()
    {

    }


function updateMenuValues()
    {
    MENU_TRIES_LEFT.innerText = CURRENT_TRIES_LEFT;
    MENU_UNITS_LEFT.innerText = UNITS_LEFT.length;
    }


function showMessage( text: string, className?: string )
    {
    if ( typeof className === 'undefined' )
        {
        className = '';
        }

    window.clearTimeout( MESSAGE_ID );

    MESSAGE_ELEMENT.className = className;
    MESSAGE_ELEMENT.innerText = text;

    MESSAGE_ID = window.setTimeout( function()
        {
        MESSAGE_ELEMENT.className = '';
        MESSAGE_ELEMENT.innerText = '----';
        }, 2000 );
    }
}