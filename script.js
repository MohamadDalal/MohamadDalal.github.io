// function adjustAside() {
//     $("aside").css("top", "calc(" + $("aside").css("margin-top") + " + " + $("header").css("height") + ")");
//     console.log($("aside").css("top"));
//     console.log($("aside").css("margin-top"));
//     console.log($("header").outerHeight(true));
//     console.log(document.querySelector("header").clientHeight);
// }

function adjustFooter() {
    if ($(document).height() <= $(window).height()){
        $("footer").css("position", "fixed");
        $("footer").css("bottom", "0");
    }
    else {
        $("footer").css("position", "sticky");
    }
}

function loadArticle(filename){
    $("article").load(filename);
}

function setDarkMode() {
    document.body.style.setProperty("--main-bg-color", "black");
    document.body.style.setProperty("--main-text-color", "white");

    $("#buttonPageColor").text("Light Mode");
    $("#buttonPageColor").attr("onclick", "setLightMode()");
}

function setLightMode() {
    document.body.style.setProperty("--main-bg-color", "white");
    document.body.style.setProperty("--main-text-color", "black");
    
    $("#buttonPageColor").text("Dark Mode");
    $("#buttonPageColor").attr("onclick", "setDarkMode()");
}

function sideLinkHover(event) {
    // console.log(event.target);
    event.target.parentElement.style.color = "white";
}

function sideLinkUnHover(event) {
    // console.log(event.target);
    event.target.parentElement.style.color = "black";
}
$(document).ready(function() {
    //const computedStyle = window.getComputedStyle(document.body);

    // $("aside > ul > li").children().hover(sideLinkHover, sideLinkUnHover);

    // window.addEventListener("resize", adjustAside);
    // setTimeout(adjustAside, 200);

    $("nav").load("/SharedComponents/NavBar.html");
    $("footer").load("/SharedComponents/Footer.html");
    adjustFooter();
    $("aside").on("click", function(){setTimeout(adjustFooter, 100)});
});
// Use this for functions that need to calculate positions and sizes
// Makes sure the window is fully loaded before calculating
// $(window).on('load', function() {
    
// });