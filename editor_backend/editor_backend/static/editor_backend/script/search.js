

var searchResultHtml;
var searchInput;
var dummyArticle = {"title":"Article title",

                    "desc":"Praesent sed magna congue, egestas urna eu, posuere est. " +
                    "Nulla pretium dolor nec velit egestas, sit amet auctor dui tempus.",

                    "article":"Interdum et malesuada fames ac ante ipsum primis in faucibus." +
                    " Aenean a mattis nibh, ac luctus augue. Vestibulum eleifend, massa et vehicula " +
                    "volutpat, nulla sapien malesuada leo, at posuere quam magna et neque. Morbi ut " +
                    "ante auctor, pretium sem vel, iaculis libero. Pellentesque dictum ipsum ac dolor " +
                    "consectetur, maximus sodales neque dapibus. Fusce efficitur eros ac nisi auctor, " +
                    "id rhoncus augue feugiat. Phasellus turpis massa, dictum quis arcu vitae, " +
                    "ultrices hendrerit dolor. Curabitur dapibus dapibus dui et semper. Nunc dui leo, " +
                    "suscipit at efficitur eu, consectetur et eros. Phasellus id semper ligula. " +
                    "Maecenas laoreet lectus in ante congue mattis. Vivamus mattis tortor at odio " +
                    "varius tincidunt.",

                    "url":"/"};





window.onload = function() {
    init();
};


function init() {
    searchResultHtml = document.getElementById("searchResultContainer");
    searchInput = document.getElementById("searchField");

    searchInput.addEventListener("keyup", search);




}

/**
 * TODO: Make this do a real search based on the content of searchInput
 */
function search() {
    var results = [];

    /**
     * This is testcode and shoudl be removed later
     */
    for (var i = 0; i < 10; i++){
        results[i] = {"title": i, desc:i + " Praesent sed magna congue, egestas urna eu, posuere est.",
            "article": "long shit", "url":"/"}
    }
    /**
     * End of test code
     */


    for (var i = 0; i< results.length; i++){
        addArticleToResult(results[i]);
    }
}


function addArticleToResult(article) {
    searchResultHtml.innerHTML +=
        '<div class="searchResult"> ' +
        '<a href=" '+ article.url+' "> ' +
        '<h3> ' + article.title + ' </h3> ' +
        '<p>' + article.desc + ' </p> ' +
        '</a> ' +
        '</div>';
}
