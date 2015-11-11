/// <reference path="../libraries/game_engine.1.3.1.d.ts" />
/// <reference path="list.ts" />

window.onload = function()
{
Main.init();
};


module Main
{
var UNITS_NAMES = {
    baneling: { race: 'zerg' },
    broodling: { race: 'zerg' },
    broodlord: { race: 'zerg' },
    changeling: { race: 'zerg' },
    corruptor: { race: 'zerg' },
    drone: { race: 'zerg' },
    hydralisk: { race: 'zerg' },
    'infested terran': { race: 'zerg' },
    infestor: { race: 'zerg' },
    lurker: { race: 'zerg' },
    mutalisk: { race: 'zerg' },
    overlord: { race: 'zerg' },
    overseer: { race: 'zerg' },
    queen: { race: 'zerg' },
    ravager: { race: 'zerg' },
    roach: { race: 'zerg' },
    'swarm host': { race: 'zerg' },
    ultralisk: { race: 'zerg' },
    viper: { race: 'zerg' },
    zergling: { race: 'zerg' },

    adept: { race: 'protoss' },
    archon: { race: 'protoss' },
    carrier: { race: 'protoss' },
    colossus: { race: 'protoss' },
    'dark templar': { race: 'protoss' },
    disruptor: { race: 'protoss' },
    'high templar': { race: 'protoss' },
    immortal: { race: 'protoss' },
    mothership: { race: 'protoss' },
    observer: { race: 'protoss' },
    oracle: { race: 'protoss' },
    phoenix: { race: 'protoss' },
    probe: { race: 'protoss' },
    sentry: { race: 'protoss' },
    stalker: { race: 'protoss' },
    tempest: { race: 'protoss' },
    'void ray': { race: 'protoss' },
    'warp prism': { race: 'protoss' },
    zealot: { race: 'protoss' },

    banshee: { race: 'terran' },
    battlecruiser: { race: 'terran' },
    cyclone: { race: 'terran' },
    ghost: { race: 'terran' },
    hellbat: { race: 'terran' },
    hellion: { race: 'terran' },
    liberator: { race: 'terran' },
    marauder: { race: 'terran' },
    marine: { race: 'terran' },
    medivac: { race: 'terran' },
    mule: { race: 'terran' },
    raven: { race: 'terran' },
    reaper: { race: 'terran' },
    scv: { race: 'terran' },
    'siege tank': { race: 'terran' },
    thor: { race: 'terran' },
    viking: { race: 'terran' },
    'widow mine': { race: 'terran' }
};


    // html elements
var MENU_UNITS_LEFT;
var MENU_SCORE;
var MENU_HIGHEST_SCORE;
var AUDIO_ELEMENT;
var MESSAGE_ELEMENT;
var SEARCH_ELEMENT;
var CURRENT_SELECTED_FILTER;

    // game values
var CURRENT_UNIT = '';
var UNITS_LEFT = [];
var SCORE = 0;

var MESSAGE_ID;
var TIMER_ID;
var LIST;


export function init()
    {
    Game.HighScore.init( 1, 'sc_guess_unit_high_score', false );
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
    MENU_HIGHEST_SCORE = document.querySelector( '#HighestScore' );
    SEARCH_ELEMENT = document.querySelector( '#Search' );

        // add the event listeners to the search element
    SEARCH_ELEMENT.addEventListener( 'input', function( event )
        {
        LIST.search( event.target.value );

            // the search is done with all the units, so update the filter element
        var listAll = <HTMLElement> document.querySelector( '#ListAll' );

        updateSelectedListFilter( listAll );

        });
    SEARCH_ELEMENT.addEventListener( 'keyup', function( event )
        {
            // on enter, try to guess the first list item
        if ( event.keyCode === Game.Utilities.KEY_CODE.enter )
            {
            var first = LIST.getFirstItem();

            if ( first )
                {
                guess( first.innerHTML );
                }
            }
        });

        // add event listener to the skip element
    var skip = document.querySelector( '#Skip' );

    skip.addEventListener( 'click', function( event )
        {
        guess();
        });

        // add event listener to the reload element
    var reload = document.querySelector( '#Reload' );

    reload.addEventListener( 'click', function( event )
        {
        if ( AUDIO_ELEMENT )
            {
            AUDIO_ELEMENT.load();
            }
        });

        // add event listener to restart the game
    var restart = document.querySelector( '#Restart' );

    restart.addEventListener( 'click', function( event )
        {
        clear();
        start();
        });

        // add event listener to the list's filters
    var listFilters = document.querySelector( '#ListFilters' );
    CURRENT_SELECTED_FILTER = document.querySelector( '#ListAll' );

    listFilters.addEventListener( 'click', function( event )
        {
        var target = <HTMLElement> event.target;

        if ( target.tagName.toLowerCase() === 'li' )
            {
            filterList( target );
            }
        });


        // update the highest score element
    updateHighestScore();
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
 * Check if a guess is correct. If no argument is provided, it means to skip the current unit.
 */
export function guess( unitName?: string )
    {
    var skip = false;
    var hasEnded = false;

    if ( typeof unitName === 'undefined' )
        {
        skip = true;
        }


    if ( unitName === CURRENT_UNIT ||
         skip === true )
        {
        if ( skip )
            {
            setScore( SCORE - 10 );
            showMessage( CURRENT_UNIT );
            }

        else
            {
            setScore( SCORE + 10 );
            showMessage( 'Correct!', 'correct' );
            }


        hasEnded = getNextUnit();

            // clear the search and the filters (in case it was used to get the correct unit)
        SEARCH_ELEMENT.value = '';

        var listAll = <HTMLElement> document.querySelector( '#ListAll' );

        filterList( listAll );
        }

    else
        {
        setScore( SCORE - 5 );
        showMessage( 'Incorrect!', 'incorrect' );
        }


    if ( !hasEnded )
        {
        SEARCH_ELEMENT.focus();
        }
    }


/**
 * Get a random new unit, or end the game if we've passed through all of them.
 *
 * @return Whether the game has ended or not.
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

        if ( AUDIO_ELEMENT.canPlayType( 'audio/ogg' ) )
            {
            AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT + '.ogg';
            }

        else
            {
            AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT + '.mp3';
            }

        AUDIO_ELEMENT.play();
        }

        // game over
    else
        {
        gameOver();
        return true;
        }

    return false;
    }


function clear()
    {
        // the audio may be playing
    AUDIO_ELEMENT.pause();

        // clear the timer interval
    window.clearInterval( TIMER_ID );
    }


function gameOver()
    {
    clear();

        // remove focus from the search element
    SEARCH_ELEMENT.blur();

        // compare this score with the highest score
        // and update the menu element with the highest score
    Game.HighScore.add( 'score', SCORE );
    updateHighestScore();


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


/**
 * Set a new score, and update the menu element as well.
 */
function setScore( value: number )
    {
    SCORE = value;
    MENU_SCORE.innerHTML = value;
    }


/**
 * Update the menu element with the current number of units left.
 */
function setUnitsLeft( value: number )
    {
    MENU_UNITS_LEFT.innerHTML = value;
    }


/**
 * Update the `highest score` menu element with the current highest score.
 */
function updateHighestScore()
    {
    var score = Game.HighScore.get( 'score' );

    if ( score && score.length > 0 )
        {
        MENU_HIGHEST_SCORE.innerHTML = score[ 0 ];
        }

    else
        {
        MENU_HIGHEST_SCORE.innerHTML = '---';
        }
    }


/**
 * @param text The message to show.
 * @param className Optional class name to add to the html element, for some specific styling.
 */
function showMessage( text: string, className?: string )
    {
    if ( typeof className === 'undefined' )
        {
        className = '';
        }

    window.clearTimeout( MESSAGE_ID );

    MESSAGE_ELEMENT.className = className;
    MESSAGE_ELEMENT.innerHTML = text;

    MESSAGE_ID = window.setTimeout( function()
        {
        MESSAGE_ELEMENT.className = '';
        MESSAGE_ELEMENT.innerHTML = '----';
        }, 2000 );
    }


/**
 * Filter the list, to only show the units of the given race.
 */
function filterList( element: HTMLElement )
    {
    var names = Object.keys( UNITS_NAMES );
    var length = names.length;
    var race = element.innerHTML.toLowerCase();

    var filteredNames = [];

        // show all the units
    if ( race === 'all' )
        {
        filteredNames = names;
        }

        // value will be 'zerg', 'protoss' or 'terran'
        // show only the units of the selected race
    else
        {
        for (var a = 0 ; a < length ; a++)
            {
            var name = names[ a ];
            var info = UNITS_NAMES[ name ];

            if ( info.race === race )
                {
                filteredNames.push( name );
                }
            }
        }

        // move the 'selected' css class from the previous selected element
    updateSelectedListFilter( element );

        // show the filtered units only
    LIST.buildList( filteredNames );

        // clear the search
    SEARCH_ELEMENT.value = '';
    SEARCH_ELEMENT.focus();
    }


/**
 * Move the 'selected' css class from the previous selected element to the new one.
 */
function updateSelectedListFilter( element: HTMLElement )
    {
    CURRENT_SELECTED_FILTER.classList.remove( 'selected' );
    CURRENT_SELECTED_FILTER = element;
    CURRENT_SELECTED_FILTER.classList.add( 'selected' );
    }
}