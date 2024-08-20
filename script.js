function adjustAside() {
    let header = document.querySelector("header");
    let aside = document.querySelector("aside");
    aside.style.top = header.clientHeight + Number(window.getComputedStyle(aside).marginTop.slice(0, -2)) + "px";
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
    const computedStyle = window.getComputedStyle(document.body);

    $("aside > ul > li").children().hover(sideLinkHover, sideLinkUnHover);

    adjustAside();
    window.addEventListener("resize", adjustAside);

    $("#buttonLightMode").css("display", "none");
});