module.exports = function() {
    function judge( sensor, measure, rules ) {
        return false;
    }

    return {
        judge: judge
    }
}();