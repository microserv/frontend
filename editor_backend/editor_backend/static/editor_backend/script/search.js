

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

    // Splits the search and sends the current word and total search length to
    // the word suggestion function
    var searchWords = searchInput.value.split(" ");
    wordSuggestion(searchWords[searchWords.length-1], searchInput.value.length);

    for (var i = 0; i< results.length; i++){
        addArticleToResult(results[i]);
    }
}

/**
 * Takes in a word and the current search length and provides a button for
 * suggesting a different word if it is a possibility that it is misspelled.
 * @param word
 * @param searchLength
 */
function wordSuggestion(word, searchLength) {
    searchLength = searchLength - word.length;
    var suggestionField = document.getElementById("wordSuggestionField");
    if (word != "") {
         suggestionField.innerHTML = "<button id='wordSuggestionButton'>" + word +" </button>";
        var margin = 0;

        if (searchLength > 5 ) {
            margin = (8.2 * searchLength) +5;
            if (margin > 700) {
                margin = 700;  //prevents the suggestions from goint out of the screen
            }
        }
        // Aligns the suggestion with where you are in the input field
        document.getElementById("wordSuggestionButton").style.marginLeft =   margin + "px";
    }
    else {
        suggestionField.innerHTML = "";
    }
}

/**
 * Takes in an article and adds it to the results in the view
 * @param article
 */
function addArticleToResult(article) {
    searchResultHtml.innerHTML +=
        '<div class="searchResult"> ' +
        '<a href=" '+ article.url+' "> ' +
        '<h3> ' + article.title + ' </h3> ' +
        '<p>' + article.desc + ' </p> ' +
        '</a> ' +
        '</div>';
}
