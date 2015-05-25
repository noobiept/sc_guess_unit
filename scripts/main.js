/// <reference path="list.ts" />
window.onload = function () {
    Main.init();
};
var Main;
(function (Main) {
    var UNITS_NAMES = [
        'Larva',
        'Drone',
        'Queen',
        'Zergling',
        'Baneling',
        'Roach',
        'Hydralisk',
        'Infestor',
        'Swarm Host',
        'Ultralisk',
        'Locust',
        'Broodling',
        'Changeling',
        'Infested Terran',
        'Nydus Worm',
        'Overlord',
        'Overseer',
        'Mutalisk',
        'Corruptor',
        'Broodlord',
        'Viper',
        'Probe',
        'Zealot',
        'Stalker',
        'Sentry',
        'High Templar',
        'Dark Templar',
        'Immortal',
        'Colossus',
        'Archon',
        'Observer',
        'Warp Prism',
        'Phoenix',
        'Void Ray',
        'Oracle',
        'Carrier',
        'Tempest',
        'Mothership Core',
        'Mothership',
        'SCV',
        'MULE',
        'Marine',
        'Marauder',
        'Reaper',
        'Ghost',
        'Hellion',
        'Hellbat',
        'Siege Tank',
        'Widow Mine',
        'Thor',
        'Auto-Turret',
        'Viking',
        'Medivac',
        'Raven',
        'Banshee',
        'Battlecruiser',
        'Point Defense Drone'
    ];
    // menu elements
    var UNITS_LEFT;
    var TRIES_LEFT;
    // game values
    var CURRENT_UNIT = '';
    var CURRENT_TRIES_LEFT = 3;
    var LIST;
    function init() {
        initMenu();
        LIST = new List({
            values: UNITS_NAMES,
            container: document.body
        });
        CURRENT_UNIT = 'Zergling';
    }
    Main.init = init;
    function initMenu() {
        UNITS_LEFT = document.querySelector('#UnitsLeft');
        TRIES_LEFT = document.querySelector('#TriesLeft');
        var search = document.querySelector('#Search');
        search.addEventListener('input', function (event) {
            LIST.search(event.srcElement.value);
        });
    }
    function guess(unitName) {
        if (unitName === CURRENT_UNIT) {
            getNextUnit();
        }
        else {
            CURRENT_TRIES_LEFT--;
            if (CURRENT_TRIES_LEFT < 0) {
                gameOver();
            }
        }
    }
    Main.guess = guess;
    function getNextUnit() {
    }
    function gameOver() {
    }
})(Main || (Main = {}));
