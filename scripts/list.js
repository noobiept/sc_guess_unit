var List = (function () {
    function List(args) {
        var _this = this;
        var container = document.createElement('div');
        container.className = 'List';
        var ul = document.createElement('ul');
        var length = args.values.length;
        ul.addEventListener('click', function (event) {
            _this.clickListener(event);
        });
        for (var a = 0; a < length; a++) {
            var value = document.createElement('li');
            value.innerHTML = args.values[a];
            ul.appendChild(value);
        }
        container.appendChild(ul);
        args.container.appendChild(container);
        this.ul = ul;
        this.values = args.values;
    }
    List.prototype.clickListener = function (event) {
        var sourceElement = event.srcElement;
        console.log(sourceElement.innerText);
        Main.guess(sourceElement.innerText);
    };
    List.prototype.search = function (value) {
        var re = new RegExp(value, 'i');
        var matchValues = [];
        var length = this.values.length;
        var a;
        for (a = 0; a < length; a++) {
            var value = this.values[a];
            if (re.test(value)) {
                matchValues.push(value);
            }
        }
        // clear the previous list
        this.ul.innerHTML = '';
        // add the values that matched the search
        length = matchValues.length;
        for (a = 0; a < length; a++) {
            var li = document.createElement('li');
            li.innerHTML = matchValues[a];
            this.ul.appendChild(li);
        }
    };
    return List;
})();
