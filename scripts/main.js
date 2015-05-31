window.onload = function () {
    Main.init();
};
var Main;
(function (Main) {
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
        'swarm host': { race: 'zerg' },
        ultralisk: { race: 'zerg' },
        viper: { race: 'zerg' },
        zergling: { race: 'zerg' },
        archon: { race: 'protoss' },
        carrier: { race: 'protoss' },
        colossus: { race: 'protoss' },
        'dark templar': { race: 'protoss' },
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
        ghost: { race: 'terran' },
        hellbat: { race: 'terran' },
        hellion: { race: 'terran' },
        marauder: { race: 'terran' },
        marine: { race: 'terran' },
        medivac: { race: 'terran' },
        raven: { race: 'terran' },
        reaper: { race: 'terran' },
        scv: { race: 'terran' },
        'siege tank': { race: 'terran' },
        thor: { race: 'terran' },
        viking: { race: 'terran' },
        'widow mine': { race: 'terran' }
    };
    var MENU_UNITS_LEFT;
    var MENU_SCORE;
    var MENU_HIGHEST_SCORE;
    var AUDIO_ELEMENT;
    var MESSAGE_ELEMENT;
    var SEARCH_ELEMENT;
    var CURRENT_UNIT = '';
    var UNITS_LEFT = [];
    var SCORE = 0;
    var MESSAGE_ID;
    var TIMER_ID;
    var LIST;
    function init() {
        Game.HighScore.init(1, 'sc_guess_unit_high_score', false);
        initMenu();
        AUDIO_ELEMENT = document.querySelector('#Audio');
        MESSAGE_ELEMENT = document.querySelector('#Message');
        LIST = new List({
            units_info: UNITS_NAMES,
            container: document.body
        });
        start();
    }
    Main.init = init;
    function initMenu() {
        MENU_UNITS_LEFT = document.querySelector('#UnitsLeft');
        MENU_SCORE = document.querySelector('#Score');
        MENU_HIGHEST_SCORE = document.querySelector('#HighestScore');
        SEARCH_ELEMENT = document.querySelector('#Search');
        SEARCH_ELEMENT.addEventListener('input', function (event) {
            LIST.search(event.target.value);
        });
        SEARCH_ELEMENT.addEventListener('keyup', function (event) {
            if (event.keyCode === Utilities.KEY_CODE.enter) {
                var first = LIST.getFirstItem();
                if (first) {
                    guess(first.innerHTML);
                }
            }
        });
        var skip = document.querySelector('#Skip');
        skip.addEventListener('click', function (event) {
            guess();
        });
        var reload = document.querySelector('#Reload');
        reload.addEventListener('click', function (event) {
            if (AUDIO_ELEMENT) {
                AUDIO_ELEMENT.load();
            }
        });
        updateHighestScore();
    }
    function start() {
        CURRENT_UNIT = '';
        UNITS_LEFT = Object.keys(UNITS_NAMES);
        setScore(100);
        TIMER_ID = window.setInterval(function () {
            setScore(SCORE - 1);
        }, 1000);
        getNextUnit();
        SEARCH_ELEMENT.focus();
    }
    function guess(unitName) {
        var skip = false;
        var hasEnded = false;
        if (typeof unitName === 'undefined') {
            skip = true;
        }
        if (unitName === CURRENT_UNIT || skip === true) {
            if (skip) {
                setScore(SCORE - 10);
                showMessage(CURRENT_UNIT);
            }
            else {
                setScore(SCORE + 10);
                showMessage('Correct!', 'correct');
            }
            hasEnded = getNextUnit();
            if (SEARCH_ELEMENT.value !== '') {
                SEARCH_ELEMENT.value = '';
                LIST.search('');
            }
        }
        else {
            setScore(SCORE - 5);
            showMessage('Incorrect!', 'incorrect');
        }
        if (!hasEnded) {
            SEARCH_ELEMENT.focus();
        }
    }
    Main.guess = guess;
    function getNextUnit() {
        setUnitsLeft(UNITS_LEFT.length);
        var length = UNITS_LEFT.length;
        if (length > 0) {
            var position = Math.floor(Math.random() * length);
            CURRENT_UNIT = UNITS_LEFT.splice(position, 1)[0];
            if (AUDIO_ELEMENT.canPlayType('audio/ogg')) {
                AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT + '.ogg';
            }
            else {
                AUDIO_ELEMENT.src = 'audio/' + CURRENT_UNIT + '.mp3';
            }
            AUDIO_ELEMENT.play();
        }
        else {
            gameOver();
            return true;
        }
        return false;
    }
    function gameOver() {
        AUDIO_ELEMENT.pause();
        window.clearInterval(TIMER_ID);
        SEARCH_ELEMENT.blur();
        Game.HighScore.add('score', SCORE);
        updateHighestScore();
        var ok = new Game.Html.Button({
            value: 'Ok',
            callback: function (button) {
                message.clear();
                start();
            }
        });
        var message = new Game.Message({
            body: ['You Won!', 'Score: ' + SCORE],
            buttons: ok,
            container: document.body,
            background: true
        });
    }
    function setScore(value) {
        SCORE = value;
        MENU_SCORE.innerHTML = value;
    }
    function setUnitsLeft(value) {
        MENU_UNITS_LEFT.innerHTML = value;
    }
    function updateHighestScore() {
        var score = Game.HighScore.get('score');
        if (score && score.length > 0) {
            MENU_HIGHEST_SCORE.innerHTML = score[0];
        }
        else {
            MENU_HIGHEST_SCORE.innerHTML = '---';
        }
    }
    function showMessage(text, className) {
        if (typeof className === 'undefined') {
            className = '';
        }
        window.clearTimeout(MESSAGE_ID);
        MESSAGE_ELEMENT.className = className;
        MESSAGE_ELEMENT.innerHTML = text;
        MESSAGE_ID = window.setTimeout(function () {
            MESSAGE_ELEMENT.className = '';
            MESSAGE_ELEMENT.innerHTML = '----';
        }, 2000);
    }
})(Main || (Main = {}));
//# sourceMappingURL=main.js.map