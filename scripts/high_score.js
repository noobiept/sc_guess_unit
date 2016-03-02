var HighScore;
(function (HighScore) {
    var HIGH_SCORE = {};
    function add(key, value) {
        var previous = HIGH_SCORE[key];
        if (isNaN(previous)) {
            HIGH_SCORE[key] = value;
            save();
        }
        else if (value > previous) {
            HIGH_SCORE[key] = value;
            save();
        }
    }
    HighScore.add = add;
    function get(key) {
        return HIGH_SCORE[key];
    }
    HighScore.get = get;
    function save() {
        AppStorage.setData({ sc_guess_unit_high_score: HIGH_SCORE });
    }
    function load(callback) {
        AppStorage.getData('sc_guess_unit_high_score', function (data) {
            var score = data['sc_guess_unit_high_score'];
            if (typeof score !== 'undefined' && score !== null) {
                HIGH_SCORE = score;
            }
            callback();
        });
    }
    HighScore.load = load;
})(HighScore || (HighScore = {}));
