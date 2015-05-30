var List = (function () {
    function List(args) {
        var _this = this;
        var container = document.createElement('div');
        container.className = 'List';
        var ul = document.createElement('ul');
        var unitsNames = Object.keys(args.units_info);
        ul.addEventListener('click', function (event) {
            _this.clickListener(event);
        });
        container.appendChild(ul);
        args.container.appendChild(container);
        this.ul = ul;
        this.unit_names = unitsNames;
        this.units_info = args.units_info;
        this.buildList(unitsNames);
    }
    /**
     * Called when the player clicks on an item off the list. Will try to guess that unit name.
     */
    List.prototype.clickListener = function (event) {
        var sourceElement = event.srcElement;
        // don't try to guess if it was clicked on the ul
        if (sourceElement.tagName.toLowerCase() === 'li') {
            Main.guess(sourceElement.innerText);
        }
    };
    /**
     * Show only the units whose name match with the `value` given.
     */
    List.prototype.search = function (value) {
        var re = new RegExp(value, 'i');
        var matchValues = [];
        var length = this.unit_names.length;
        var a;
        for (a = 0; a < length; a++) {
            var name = this.unit_names[a];
            if (re.test(name)) {
                matchValues.push(name);
            }
        }
        // clear the previous list
        this.ul.innerHTML = '';
        // add the values that matched the search
        this.buildList(matchValues);
    };
    /**
     * Build a new list, with the names given.
     */
    List.prototype.buildList = function (unitNames) {
        var length = unitNames.length;
        for (var a = 0; a < length; a++) {
            var unit = document.createElement('li');
            var unitName = unitNames[a];
            var race = this.units_info[unitName].race;
            unit.innerHTML = unitName;
            unit.className = race;
            this.ul.appendChild(unit);
        }
    };
    /**
     * Get the first list item, or `null` if the list is empty.
     */
    List.prototype.getFirstItem = function () {
        if (this.ul.children.length > 0) {
            return this.ul.children[0];
        }
        return null;
    };
    return List;
})();
