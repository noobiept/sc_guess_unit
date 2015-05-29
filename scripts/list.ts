interface ListArgs
    {
    units_info: Object;
    container: HTMLElement;
    }

class List
    {
    unit_names: string[];
    units_info: Object;
    ul: HTMLUListElement;

    constructor( args: ListArgs )
        {
        var _this = this;
        var container = document.createElement( 'div' );

        container.className = 'List';

        var ul = document.createElement( 'ul' );
        var unitsNames = Object.keys( args.units_info );

        ul.addEventListener( 'click', function( event )
            {
            _this.clickListener( event );
            });

        container.appendChild( ul );
        args.container.appendChild( container );

        this.ul = ul;
        this.unit_names = unitsNames;
        this.units_info = args.units_info;

        this.buildList( unitsNames );
        }


    clickListener( event: MouseEvent )
        {
        var sourceElement = <HTMLElement> event.srcElement;

            // don't try to guess if it was clicked on the ul
        if ( sourceElement.tagName.toLowerCase() === 'li' )
            {
            Main.guess( sourceElement.innerText );
            }
        }


    /**
     * Show only the units whose name match with the `value` given.
     */
    search( value: string )
        {
        var re = new RegExp( value, 'i' );
        var matchValues = [];
        var length = this.unit_names.length;
        var a;

        for (a = 0 ; a < length ; a++)
            {
            var name = this.unit_names[ a ];

            if ( re.test( name ) )
                {
                matchValues.push( name );
                }
            }

            // clear the previous list
        this.ul.innerHTML = '';

            // add the values that matched the search
        this.buildList( matchValues );
        }


    buildList( unitNames: string[] )
        {
        var length = unitNames.length;

        for (var a = 0 ; a < length ; a++)
            {
            var unit = document.createElement( 'li' );
            var unitName = unitNames[ a ];
            var race = this.units_info[ unitName ].race;

            unit.innerHTML = unitName;
            unit.className = race;

            this.ul.appendChild( unit );
            }
        }


    getFirstItem()
        {
        if ( this.ul.children.length > 0 )
            {
            return this.ul.children[ 0 ];
            }

        return null;
        }
    }