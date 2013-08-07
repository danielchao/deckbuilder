function paginator(per_page) {
    var that = {};
    var cards;
    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    that.handlePaginationClick = function(new_page_index, pagination_container) {
        for(var i = new_page_index * per_page; 
            i < per_page + new_page_index * per_page && i < cards.length;
            i++) 
        {
            $('#list-cards').append('<tr><td><a class="card" id= "'
                + cards[i][0] + '">'
                + cards[i][1] + '</a></td>'
                + '<td>' + cards[i][2] + '</td>'
                + '<td>' + cards[i][3] + '</td>'
                + '<td><a href = "' + cards[i][4] + '"> More'
                + '</a></td></tr>'); 
        }

        var hover = hoverHandler($(".card"));
        hover.bindHover();
        hover.bindAddOnClick();
        return false;
    }
    that.handleSearchRequest = function(form) {
        delay(function(){
            $.post(form.action, $(form).serialize(), function(data) {
                cards = data;
                $("#list-cards").pagination(data.length, {
                    items_per_page:per_page,
                    callback:that.handlePaginationClick
                });
            },"json")
        }, 300);
    }
    return that;
}

function dealer() {
    var that = {};
    that.generateDeck = function(form) {
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
                $(form).append($('<input>').attr({
                    name: "card[name]",
                    value: match[2],
                    type: 'hidden'
                }));
                that.renderCards(parseInt(match[1]), form);
                $(form).children().last().remove();
            } 
        }
        return false;
    }
    that.renderCards = function(count, form) {
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
                var hover = hoverHandler($(".match"));
                hover.bindHover();

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
    return that;
}

function hoverHandler(elements) {
    var that = {};
    var displayCard = function(link, e) {
        $('#preview').attr("src", link).fadeIn(0).offset({
            top: $(window).scrollTop() + 100 
        });
    }
    
    that.bindHover = function() {
        elements.mouseenter(function(e) {
            displayCard($(this).prop("id"), e);
        }).mouseleave(function() {
            $('#preview').fadeOut(0);
        });
    }

    that.bindAddOnClick = function() {
        elements.click(function() {
            addCard($(this).html());
        });
    }
    return that;
}

$(document).ready(function() {
    var page = paginator(20);
    var deal = dealer();
    //Search and paginator handler
    $("#search-form").keyup(function(){
        page.handleSearchRequest(this);
    });

    //Let ajax handle search
    $('#search-form').submit(function() {
        return false;
    });

    //Sync hidden div with deck div for form submission
    $(".edit_deck").submit(function() {
        $("#deck-input").val($("#deck-div").html()); 
    });

    //Generate deck visual
    $("#generate-form").submit(function() {
        deal.generateDeck(this);
        return false;
    });
});

//refactor
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

