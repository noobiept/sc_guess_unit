module HighScore
{
var HIGH_SCORE: { [key: string]: number } = {};


export function add( key: string, value: number )
    {
    var previous = HIGH_SCORE[ key ];

    if ( isNaN( previous ) )
        {
        HIGH_SCORE[ key ] = value;
        save();
        }

    else if ( value > previous )
        {
        HIGH_SCORE[ key ] = value;
        save();
        }
    }


export function get( key: string ): number
    {
    return HIGH_SCORE[ key ];
    }


function save()
    {
    AppStorage.setData({ sc_guess_unit_high_score: HIGH_SCORE });
    }


export function load( callback )
    {
    AppStorage.getData( 'sc_guess_unit_high_score', function( data )
        {
        var score = data[ 'sc_guess_unit_high_score' ];

        if ( typeof score !== 'undefined' && score !== null )
            {
            HIGH_SCORE = score;
            }

        callback();
        });
    }
}
