/**
 * Merge all the given dictionaries into a single one.
 */
function mergeDicts( ...dicts: Object[] )
{
var result = {};

for (var a = 0 ; a < dicts.length ; a++)
    {
    var dict = dicts[ a ];

    for (var key in dict)
        {
        if ( dict.hasOwnProperty( key ) )
            {
            result[ key ] = dict[ key ];
            }
        }
    }

return result;
}