$(document).ready(function() {
    $("#search-form").keyup(function(){
        var that = this;
        delay(function(){
            $.post(that.action, $(that).serialize(), function(data) {
                $('.preview').html("");
                for (var i = data.length-1; i >= 0; i--) {
                    $('.preview').append('<img src="' + data[i][0] + '">');
                }
            },"json")
        }, 300);
    });
    $('#search-form').submit(function() {
        return false;
    });
});

var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
