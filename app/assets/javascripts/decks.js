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

        hoverHandler($(".card")).bindHover().bindAddOnClick();
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
    var requests = 0;
    var locked = false;
    
    var renderImageStack = function(count, imgSrc, destination) {
        //Stagger Images Cards
        var imgs = "";
        var cardGap = 8;
        if (count > 10) {
            width = 200;
            count = 10;
            cardGap = 35 / count;
        }
        var width = 220 - cardGap * (count - 1);
        for (var i = 0; i < count; i++) { 
            imgs += ("<img style='left: "
                    + parseInt(i * cardGap)
                    + "px; top: "
                    + parseInt(i * cardGap / 0.7011)
                    + "px; width: "
                    + width
                    + "px' class='deck-image' src='" + imgSrc + "'>");
        }
        destination.append('<div class = "card-box">'
                + imgs
                + '</div>');
    }

    var parseCards = function(count, form, renderImages, callback) {
        $.post(form.action, $(form).serialize(), function(data) {
            if (data.length == 1) {
                $("#count").html(parseInt($("#count").html())+count);

                //Format cards in content box
                content = $("#deck-div").html();

                content = content.replace(/&nbsp;/g, ' ');

                var tag = "<a class='match' id = '" + data[0][0] + "'>" + count + " " + data[0][1] + "</a>";
                var escapedName = data[0][1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(<[^<>]*>)?" + count + " " + escapedName + "(<[^<>]*>)?", "i");

                content = content.replace(re, tag);

                if (!re.exec(content)){
                    console.log(escapedName);
                    console.log(re);
                    console.log(content);
                    console.log(data[0][1]);
                }

                $("#deck-div").html(content);
                hoverHandler($(".match")).bindHover();

                if (renderImages) {
                    renderImageStack(count, data[0][0], $('#deck-preview'));
                }
            }
            //callback upon last request finishing
            requests -= 1;
            if (requests == 0) {
                callback();
                locked = false;
            }
        });
    }

    //Show images (for Vault Page)
    that.generateImages = function() {
        var stacks = $("#deck-list").find('a');
        $("#deck-preview").html("");
        for (var i = 0; i < stacks.length; i++) {
            var regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/\(\)]*)$/;
            var match = regex.exec($(stacks[i]).html());
            renderImageStack(match[1], $(stacks[i]).attr("id"), $("#deck-preview"));
        }
    }

    //Parse deck + show images (for Edit Page)
    that.generateDeck = function(form, renderImages, callback) {
        if (!locked) {
            locked = true;
            $("#count").html("0");
            $("#deck-preview").html("");
            $("#deck-input").val($("#deck-div").html()); 
            var text = $("#deck-div").html()
                .replace(/\<div[^\>\<]*\>/g, '\n')
                .replace(/\<br[^\>\<]*\>/g, '\n')
                .replace(/\<a[^\>\<]*\>/g, '\n')
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
                    parseCards(parseInt(match[1]), form, renderImages, callback);
                    requests += 1;
                    $(form).children().last().remove();
                } 
            }
        }
        if (requests == 0) {
            callback();
            locked = false;
        }
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
        content += "<br>1 " + card;
        $('#deck-div').html(content);
    }

    that.bindHover = function() {
        elements.mouseenter(function(e) {
            displayCard($(this).prop("id"), e);
        }).mouseleave(function() {
            $('#preview').fadeOut(0);
        });
        return that;
    }

    that.bindAddOnClick = function() {
        elements.click(function() {
            addCard($(this).html());
        });
        return that;
    }
    return that;
}

$(document).ready(function() {
    var deal = dealer();
    //Real-time search
    $("#search-form").keyup(function(){
        $(this).submit();
    });

    //Search and paginator handler
    $("#search-form").submit(function() {
        paginator(20).handleSearchRequest(this);
        return false;
    });

    //Sync hidden div with deck div for form submission
    //Also parse cards in deck list before saving
    $("#save-deck").click(function() {
        deal.generateDeck($("#generate-form")[0], false, function() {
            $("#deck-input").val($("#deck-div").html()); 
            if ($(".edit_deck").length == 0){
                $(".new_deck").submit();
            }else {
                $(".edit_deck").submit();
            }
        });

    });

    //Generate deck visual
    $("#generate-form").submit(function() {
        deal.generateDeck(this, true, (function(){}));
        return false;
    });
});
