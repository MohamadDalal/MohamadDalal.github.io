// function adjustAside() {
//     $("aside").css("top", "calc(" + $("aside").css("margin-top") + " + " + $("header").css("height") + ")");
//     console.log($("aside").css("top"));
//     console.log($("aside").css("margin-top"));
//     console.log($("header").outerHeight(true));
//     console.log(document.querySelector("header").clientHeight);
// }

// Change between fixed and sticky depending on if there is a scrollbar
function adjustFooter() {
    if ($(document).height() <= $(window).height()){
        $("footer").css("position", "fixed");
        $("footer").css("bottom", "0");
    }
    else {
        $("footer").css("position", "sticky");
    }
}

// Load data inside the article tag for pages with side navigation
function loadArticle(filename){
    $("article").load(filename, function() {
        adjustFooter();
    });
}

function setDarkMode() {
    document.body.style.setProperty("--main-bg-color", "black");
    document.body.style.setProperty("--main-text-color", "white");
    localStorage.setItem("darkMode", "true");

    $("#buttonPageColor").text("Light Mode");
    $("#buttonPageColor").attr("onclick", "setLightMode()");
}

function setLightMode() {
    document.body.style.setProperty("--main-bg-color", "white");
    document.body.style.setProperty("--main-text-color", "black");
    localStorage.setItem("darkMode", "false");
    
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

$(document).ready(async function() {
    //const computedStyle = window.getComputedStyle(document.body);

    // $("aside > ul > li").children().hover(sideLinkHover, sideLinkUnHover);

    // window.addEventListener("resize", adjustAside);
    // setTimeout(adjustAside, 200);

    // We run this twice so that the page does not flicker at start
    // Second run is mainly to switch the dark mode button to light mode
    localStorage.getItem("darkMode") == "true" ? setDarkMode() : setLightMode();
    await $("nav").load("/SharedComponents/NavBar.html", function() {
        localStorage.getItem("darkMode") == "true" ? setDarkMode() : setLightMode();
    });
    await $("footer").load("/SharedComponents/Footer.html", function() {
        adjustFooter();
    });
    window.addEventListener("resize", adjustFooter);
    // $("aside").on("click", function(){setTimeout(adjustFooter, 100)});
});

// Use this for functions that need to calculate positions and sizes
// Makes sure the window is fully loaded before calculating
// $(window).on('load', function() {
    
// });