function adjustAside() {
    $("aside").css("top", "calc(" + $("aside").css("margin-top") + " + " + $("header").css("height") + ")");
}

$(document).ready(function() {
    $("aside > ul > li").children().hover(sideLinkHover, sideLinkUnHover);

    window.addEventListener("resize", adjustAside);
    setTimeout(adjustAside, 200);

});