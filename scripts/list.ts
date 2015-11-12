interface ListArgs
    {
    container: HTMLElement;
    }

class List
    {
    ul: HTMLUListElement;

    constructor( args: ListArgs )
        {
        var _this = this;
        var container = document.createElement( 'div' );

        container.className = 'List';

        var ul = document.createElement( 'ul' );

        ul.addEventListener( 'click', function( event )
            {
            _this.clickListener( event );
            });

        container.appendChild( ul );
        args.container.appendChild( container );

        this.ul = ul;
        }


    /**
     * Called when the player clicks on an item off the list. Will try to guess that unit name.
     */
    clickListener( event: MouseEvent )
        {
        var sourceElement = <HTMLElement> event.target;

            // don't try to guess if it was clicked on the ul
        if ( sourceElement.tagName.toLowerCase() === 'li' )
            {
            Main.guess( sourceElement.innerHTML );
            }
        }


    /**
     * Show only the units whose name match with the `value` given.
     */
    search( value: string, unitsList: Main.UNIT_INFO[] )
        {
        var re = new RegExp( value, 'i' );
        var matchValues = [];
        var length = unitsList.length;
        var a;

        for (a = 0 ; a < length ; a++)
            {
            var info = unitsList[ a ];

            if ( re.test( info.name ) )
                {
                matchValues.push( info );
                }
            }


            // add the values that matched the search
        this.buildList( matchValues );
        }


    /**
     * Build a new list, with the names given.
     */
    buildList( unitsList: Main.UNIT_INFO[] )
        {
            // clear the previous list
        this.ul.innerHTML = '';

        var length = unitsList.length;

        for (var a = 0 ; a < length ; a++)
            {
            var unit = document.createElement( 'li' );
            var info = unitsList[ a ];

            unit.innerHTML = info.name;
            unit.className = info.race;

            this.ul.appendChild( unit );
            }
        }


    /**
     * Get the first list item, or `null` if the list is empty.
     */
    getFirstItem()
        {
        if ( this.ul.children.length > 0 )
            {
            return this.ul.children[ 0 ];
            }

        return null;
        }
    }