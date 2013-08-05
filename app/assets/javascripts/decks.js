$(document).ready(function() {
    $("#search-form").keyup(function(){
        var that = this;
        delay(function(){
            $.post(that.action, $(that).serialize(), function(data) {
                var per_page = 20;
                $("#list-cards").pagination(data.length, {
                    items_per_page:per_page,
                    callback:handlePaginationClick
                });
                function handlePaginationClick(new_page_index, pagination_container) {

                    for(var i = new_page_index * per_page; 
                        i < per_page + new_page_index * per_page && i < data.length;
                        i++) {
                            $('#list-cards').append('<tr><td><a class="card" id= "'
                                + data[i][0] + '">'
                                + data[i][1] 
                                + '</a></td></tr>'); 
                        }
                    $(".card").mouseenter(function(e) {
                        displayCard($(this).prop("id"), e);
                    }).mouseleave(function() {
                        $('#preview').fadeOut(0);
                    }).click(function() {
                        addCard($(this).html());
                    });
                    return false;
                }
            },"json")
        }, 300);
    });
    $('#search-form').submit(function() {
        return false;
    });
});
var displayCard = function(link, e) {
    $img = $("#preview");
    $img.attr("src", link).fadeIn(0);
    $img.offset({
        top: $(window).scrollTop() + 100 
    });
}

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

