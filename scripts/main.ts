/// <reference path="../libraries/game_engine.1.3.1.d.ts" />
/// <reference path="list.ts" />

window.onload = function()
{
Main.init();
};


module Main
{
enum RACE { zerg, protoss, terran, all }
export interface UNIT_INFO { name: string; race: string; }

var UNITS = {
    zerg: [
        { name: 'baneling', race: 'zerg' },
        { name: 'broodling', race: 'zerg' },
        { name: 'broodlord', race: 'zerg' },
        { name: 'changeling', race: 'zerg' },
        { name: 'corruptor', race: 'zerg' },
        { name: 'drone', race: 'zerg' },
        { name: 'hydralisk', race: 'zerg' },
        { name: 'infested terran', race: 'zerg' },
        { name: 'infestor', race: 'zerg' },
        { name: 'lurker', race: 'zerg' },
        { name: 'mutalisk', race: 'zerg' },
        { name: 'overlord', race: 'zerg' },
        { name: 'overseer', race: 'zerg' },
        { name: 'queen', race: 'zerg' },
        { name: 'ravager', race: 'zerg' },
        { name: 'roach', race: 'zerg' },
        { name: 'swarm host', race: 'zerg' },
        { name: 'ultralisk', race: 'zerg' },
        { name: 'viper', race: 'zerg' },
        { name: 'zergling', race: 'zerg' }
    ],

    protoss: [
        { name: 'adept', race: 'protoss' },
        { name: 'archon', race: 'protoss' },
        { name: 'carrier', race: 'protoss' },
        { name: 'colossus', race: 'protoss' },
        { name: 'dark templar', race: 'protoss' },
        { name: 'disruptor', race: 'protoss' },
        { name: 'high templar', race: 'protoss' },
        { name: 'immortal', race: 'protoss' },
        { name: 'mothership', race: 'protoss' },
        { name: 'observer', race: 'protoss' },
        { name: 'oracle', race: 'protoss' },
        { name: 'phoenix', race: 'protoss' },
        { name: 'probe', race: 'protoss' },
        { name: 'sentry', race: 'protoss' },
        { name: 'stalker', race: 'protoss' },
        { name: 'tempest', race: 'protoss' },
        { name: 'void ray', race: 'protoss' },
        { name: 'warp prism', race: 'protoss' },
        { name: 'zealot', race: 'protoss' }
    ],

    terran: [
        { name: 'banshee', race: 'terran' },
        { name: 'battlecruiser', race: 'terran' },
        { name: 'cyclone', race: 'terran' },
        { name: 'ghost', race: 'terran' },
        { name: 'hellbat', race: 'terran' },
        { name: 'hellion', race: 'terran' },
        { name: 'liberator', race: 'terran' },
        { name: 'marauder', race: 'terran' },
        { name: 'marine', race: 'terran' },
        { name: 'medivac', race: 'terran' },
        { name: 'mule', race: 'terran' },
        { name: 'raven', race: 'terran' },
        { name: 'reaper', race: 'terran' },
        { name: 'scv', race: 'terran' },
        { name: 'siege tank', race: 'terran' },
        { name: 'thor', race: 'terran' },
        { name: 'viking', race: 'terran' },
        { name: 'widow mine', race: 'terran' }
    ],

    all: []     // has all the names above (will be populated later)
};


    // html elements
var MENU_UNITS_LEFT;
var MENU_SCORE;
var MENU_HIGHEST_SCORE;
var AUDIO_ELEMENT;
var MESSAGE_ELEMENT;
var SEARCH_ELEMENT;
var CURRENT_SELECTED_FILTER;
var LIST_FILTERS: {
    all: HTMLElement,
    zerg: HTMLElement,
    protoss: HTMLElement,
    terran: HTMLElement
};

    // game values
var CURRENT_UNIT: UNIT_INFO;
var CURRENT_RACE = RACE.all;
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

        // combine all units names
    UNITS.all = UNITS.zerg.concat( UNITS.protoss, UNITS.terran );

    LIST = new List({
            container: document.body
        });
    LIST.buildList( UNITS.all );

    start( CURRENT_RACE );
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
        var raceString = RACE[ CURRENT_RACE ];

        LIST.search( event.target.value, UNITS[ raceString ] );

        updateSelectedListFilter( LIST_FILTERS[ raceString ] );
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
    var restart = document.getElementById( 'Restart' );

    restart.addEventListener( 'click', function( event )
        {
        clear();
        start( CURRENT_RACE );
        });

        // when a new race is selected, start a new game giving only units of that race
    var selectRace = <HTMLSelectElement> document.getElementById( 'SelectRace' );

    selectRace.addEventListener( 'change', function( event )
        {
        var race = RACE[ selectRace.value ];

        clear();
        start( race );
        filterList( race );
        });

        // add event listener to the list's filters
    LIST_FILTERS = {
        all: document.getElementById( 'ListAll' ),
        zerg: document.getElementById( 'ListOnlyZerg' ),
        protoss: document.getElementById( 'ListOnlyProtoss' ),
        terran: document.getElementById( 'ListOnlyTerran' )
    };
    CURRENT_SELECTED_FILTER = LIST_FILTERS.all;

    LIST_FILTERS.all.addEventListener( 'click', function( event )
        {
        filterList( RACE.all );
        });
    LIST_FILTERS.zerg.addEventListener( 'click', function( event )
        {
        filterList( RACE.zerg );
        });
    LIST_FILTERS.protoss.addEventListener( 'click', function( event )
        {
        filterList( RACE.protoss );
        });
    LIST_FILTERS.terran.addEventListener( 'click', function( event )
        {
        filterList( RACE.terran );
        });

        // update the highest score element
    updateHighestScore();
    }


/**
 * Start a new game.
 * A game can have only units of a certain race, or all of them.
 */
function start( race: RACE )
    {
        // reset the state
    CURRENT_UNIT = null;
    CURRENT_RACE = race;
    UNITS_LEFT = UNITS[ RACE[ race ] ].concat();
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


    if ( unitName === CURRENT_UNIT.name ||
         skip === true )
        {
        if ( skip )
            {
            setScore( SCORE - 10 );
            showMessage( CURRENT_UNIT.name, CURRENT_UNIT.race );
            }

        else
            {
            setScore( SCORE + 10 );
            showMessage( 'Correct!', 'correct' );
            }


        hasEnded = getNextUnit();

            // clear the search and the filters (in case it was used to get the correct unit)
        SEARCH_ELEMENT.value = '';

        filterList( CURRENT_RACE );
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
            AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT.name + '.ogg';
            }

        else
            {
            AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT.name + '.mp3';
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
                start( CURRENT_RACE );
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
function filterList( race: RACE )
    {
    var raceString = RACE[ race ];
    var element = LIST_FILTERS[ raceString ];
    var filteredNames = UNITS[ raceString ];

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