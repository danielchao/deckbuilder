$(document).ready(function() {
    $("#deck-div").html($("#deck-input").val());
    var hover = hoverHandler($(".match"));
    hover.bindHover();

    //Taken from ericl's Kansas.git
    $("#deck-div")[0].addEventListener("paste", function(e) {
        // cancel paste
        e.preventDefault();

        // get text representation of clipboard
        var text = e.clipboardData.getData("text/plain");
        text = text.replace(/\n/g, '\<br\>');
        text = text.replace(/^\<br\>/g, '');

        // insert text manually
        document.execCommand("insertHTML", false, text);
    });
});

