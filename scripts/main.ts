/// <reference path="../libraries/definitions/tsd.d.ts" />
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
var MENU_SCORE;
var AUDIO_ELEMENT;
var MESSAGE_ELEMENT;
var SEARCH_ELEMENT;

    // game values
var CURRENT_UNIT = '';
var UNITS_LEFT = [];
var SCORE = 0;

var MESSAGE_ID;
var TIMER_ID;
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

    start();
    }


/**
 * Initialize the menu elements.
 */
function initMenu()
    {
    MENU_UNITS_LEFT = document.querySelector( '#UnitsLeft' );
    MENU_SCORE = document.querySelector( '#Score' );
    SEARCH_ELEMENT = document.querySelector( '#Search' );

    SEARCH_ELEMENT.addEventListener( 'input', function( event )
        {
        LIST.search( event.srcElement.value );
        });
    }


/**
 * Start a new game.
 */
function start()
    {
        // reset the state
    CURRENT_UNIT = '';
    UNITS_LEFT = Object.keys( UNITS_NAMES );
    setScore( 100 );

        // reduce the score every second
    TIMER_ID = window.setInterval( function()
        {
        setScore( SCORE - 1 );
        }, 1000 );

        // start the game
    getNextUnit();

    SEARCH_ELEMENT.focus();
    }


/**
 * Check if a guess is correct.
 */
export function guess( unitName: string )
    {
    if ( unitName === CURRENT_UNIT )
        {
        setScore( SCORE + 10 );
        showMessage( 'Correct!', 'correct' );
        getNextUnit();

            // clear the search (in case it was used to get the correct unit)
        if ( SEARCH_ELEMENT.value !== '' )
            {
            SEARCH_ELEMENT.value = '';
            LIST.search( '' );
            }
        }

    else
        {
        setScore( SCORE - 5 );
        showMessage( 'Incorrect!', 'incorrect' );
        }

    SEARCH_ELEMENT.focus();
    }


/**
 * Get a random new unit, or end the game if we've passed through all of them.
 */
function getNextUnit()
    {
    setUnitsLeft( UNITS_LEFT.length );

    var length = UNITS_LEFT.length;

    if ( length > 0 )
        {
            // random position
        var position = Math.floor( Math.random() * length );

        CURRENT_UNIT = UNITS_LEFT.splice( position, 1 )[ 0 ];

        AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT + '.ogg';
        AUDIO_ELEMENT.play();
        }

        // game over
    else
        {
        gameOver();
        }
    }


function gameOver()
    {
        // the audio may be playing
    AUDIO_ELEMENT.pause();

        // clear the timer interval
    window.clearInterval( TIMER_ID );


        // show a final message with the score
        // restart the game when 'ok' is pressed
    var ok = new Game.Html.Button({
            value: 'Ok',
            callback: function( button )
                {
                message.clear();
                start();
                }
        });

    var message = new Game.Message({
            body: [ 'You Won!', 'Score: ' + SCORE ],
            buttons: ok,
            container: document.body,
            background: true
        });
    }


function setScore( value )
    {
    SCORE = value;
    MENU_SCORE.innerText = value;
    }


function setUnitsLeft( value )
    {
    MENU_UNITS_LEFT.innerText = value;
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