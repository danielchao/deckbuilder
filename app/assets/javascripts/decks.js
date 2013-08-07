$(document).ready(function() {
    $("#search-form").keyup(function(){
        var that = this;
        //Search Function and delay
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

    //Let ajax handle search
    $('#search-form').submit(function() {
        return false;
    });

    //Update hidden div with deck div for form submision
    $(".edit_deck").submit(function() {
        $("#deck-input").val($("#deck-div").html()); 
    });

    //Generate Deck View
    $("#generate-form").submit(function() {
        $("#count").html("0");
        $("#deck-preview").html("");
        $("#deck-input").val($("#deck-div").html()); 
        var text = $("#deck-div").html()
            .replace(/\<div[^\>\<]*\>/g, '\n')
            .replace(/\<br[^\>\<]*\>/g, '\n')
            .replace(/\<[^\>\<]+\>/g, '')
            .replace(/&nbsp;/g, ' ');

        var lines = text.split("\n");
        var regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/\(\)]*)$/;
        var count = 0;
        for (i in lines) {
            var match = regex.exec(lines[i]);
            if (match) {
                $(this).append($('<input>').attr({
                    name: "card[name]",
                    value: match[2],
                    type: 'hidden'
                }));
                renderCards(parseInt(match[1]), this);
                $(this).children().last().remove();
            } 
        }
        return false;
    });
});

var renderCards = function(count, form) {
    $.post(form.action, $(form).serialize(), function(data) {
        if (data.length == 1) {
            $("#count").html(parseInt($("#count").html())+count);

            //Format cards in content box
            content = $("#deck-div").html();
            content = content.replace(/&nbsp;/g, ' ');
            var tag = "<a class='match' id = '" + data[0][0] + "'>" + count + " " + data[0][1] + "</a>";
            var re = new RegExp(count + " " + data[0][1], "i");
            content = content.replace(re, tag);
            $("#deck-div").html(content);

            $(".match").mouseenter(function(e) {
                displayCard($(this).prop("id"), e);
            }).mouseleave(function() {
                $('#preview').fadeOut(0);
            });

            //Stagger Images Cards
            var imgs = "";
            var cardGap = 8;
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

var displayCard = function(link, e) {
    $('#preview').attr("src", link).fadeIn(0).offset({
        top: $(window).scrollTop() + 100 
    });
}

var addCard = function(card) {
    var regex = /([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)/g;
    var content = $('#deck-div').html();
    var matches = content.match(regex); 
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            var regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)$/;
            var match = regex.exec(matches[i]);
            if (match && match[2].toLowerCase() == card.toLowerCase())  {
                var newInt = parseInt(match[1]) + 1;
                content = content.replace(match[1] + " " + match[2], newInt + " " + match[2]);
                $('#deck-div').html(content);
                return;
            }
        }
    }
    content += "1 " + card + "<br>";
    $('#deck-div').html(content);
}

var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
