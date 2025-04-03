// TODO: Find a way to not load article if file is not in path
$(document).ready(function() {
    // console.log("Last slash: " + window.location.href.split("/")[-1]);
    // console.log("Current URL: " + window.location.href);
    // console.log("Split URL: " + window.location.href.split("/"));
    // console.log("Last slash: " + window.location.href.split("/").at(-1));
    // console.log("Last slash split: " + window.location.href.split("/").at(-1).split("#"));
    // console.log(document.URL);
    const splitter = "?";
    const last_slash = window.location.href.split("/").at(-1);
    if (last_slash.split(splitter).length > 1){
        console.log("Inner page available: " + last_slash.split(splitter));
        const inner_page = last_slash.split(splitter).at(-1) + '.html';
        loadArticle(inner_page);
    }
});