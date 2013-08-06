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
                        i++) 
                    {
                        //data[i][3] = data[i][3] || "";
                        $('#list-cards').append('<tr><td><a class="card" id= "'
                            + data[i][0] + '">'
                            + data[i][1] + '</a></td>'
                            + '<td>' + data[i][2] + '</td>'
                            + '<td>' + data[i][3] + '</td>'
                            + '<td><a href = "' + data[i][4] + '"> More'
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

    $("#generate-form").submit(function() {
        var that = this;
        $("#deck-preview").html("");
        var lines = $("#deck-input").val().split("\n");
        var regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)(.*)$/;
        var count = 0;
        for (i in lines) {
            var match = regex.exec(lines[i]);
            if (match) {
                $(that).append($('<input>').attr({
                    name: "card[unique_name]",
                    value: match[2],
                    type: 'hidden'
                }));
                renderCards(parseInt(match[1]), that);
                $(that).children().last().remove();
            } 
        }
        return false;
    });
});
var displayCard = function(link, e) {
    $('#preview').attr("src", link).fadeIn(0).offset({
        top: $(window).scrollTop() + 100 
    });
}

var renderCards = function(count, form) {
    $.post(form.action, $(form).serialize(), function(data) {
        if (data.length == 1) {
            $("#count").html(parseInt($("#count").html())+count);
            var imgs = "";
            var cardGap = 8;
            //var minCardWidth = 180;
            if (count > 10) {
                width = 200;
                count = 10;
                cardGap = 50 / count;
            }
            var width = 220 - cardGap * (count - 1);
            for (var i = 0; i < count; i++) { 
                imgs += ("<img style='left: "
                    + parseInt(i * cardGap)
                    + "px; top: "
                    + parseInt(i * cardGap / 0.7011)
                    + "px; width: "
                    + width
                    + "px' class='deck-image' src='" + data[0][0] + "'>");
            }
            $('#deck-preview').append('<div class = "card-box">'
                + imgs
                + '</div>');
        }
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

