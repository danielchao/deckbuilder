$(document).ready(function() {
    $("#search-form").keyup(function(){
        var that = this;
        delay(function(){
            $.post(that.action, $(that).serialize(), function(data) {
                $('#preview').html("");
                console.log(data);
                for (var i = data.length-1; i >= 0; i--) {
                    $('#preview').append('<img alt="' + data[i][1] + '" class="card" src="' + data[i][0] + '">');
                }
                $(".card").click(function() {
                    addCard($(this).attr('alt'));
                    //$('#deck-input').val($('#deck-input').val() + $(this).attr('alt') + "\n");
                });
            },"json")
        }, 300);
    });
    $('#search-form').submit(function() {
        return false;
    });

});

var addCard = function(card) {
    var regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)$/;
    var content = $('#deck-input').val();
    var lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var match = regex.exec(lines[i]);
        if (match && match[2].toLowerCase() == card.toLowerCase())  {
            var newInt = parseInt(match[1]) + 1;
            content = content.replace(match[1] + " " + match[2], newInt + " " + match[2]);
            $('#deck-input').val(content);
            return;
        }
    }
    content += "\n1 " + card;
    $('#deck-input').val(content);
}

var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
