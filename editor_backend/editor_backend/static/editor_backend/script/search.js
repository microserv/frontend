var searchResultHtml;
var searchInput;
var currentSuggestion = "";
var completeSearch = false;

window.onload = function () {
    init();
};


function init() {
    searchResultHtml = document.getElementById("searchResultContainer");
    searchInput = document.getElementById("searchField");

    searchInput.addEventListener("keyup", keyboardHandler);
}

function keyboardHandler(e) {
    switch (e.keyCode) {
        case 40:
            replaceWordSuggestion();
            break;
        case 13:
            search();
            break;
        case 32:
            wordSuggestion();
            break;
        case 8:
            wipeWordSuggestion();
            break;
        default:
            completeSearch = false;
            break;
    }
}

/**
 * Handles requests towards search and displaying results
 */
function search() {
    if (searchInput.value != "") {
        completeSearch = true;
        var searchServer = "http://despina.128.no/api/search";
        var articleServer ="http://despina.128.no/publish/article_json/";

        var searchWords = searchInput.value.split(" ");

        wipeResults();

        var xhtmlSearch = new XMLHttpRequest();
        xhtmlSearch.open("POST", searchServer);
        xhtmlSearch.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhtmlSearch.send(JSON.stringify({'Partial':'false', 'Query': + searchInput.value }));
        xhtmlSearch.onreadystatechange = function() {

            if (xhtmlSearch.readyState == 4 && xhtmlSearch.status == 200) {
                var results = JSON.parse(xhtmlSearch.responseText);
                sortResults(results);
            }
        };


        function retrieveArticles(searchResult) {
            var xhtmlArticle = new XMLHttpRequest();
            xhtmlArticle.open("GET", articleServer + searchResult, true);

            xhtmlArticle.send();

            xhtmlArticle.onreadystatechange = function() {
                if (xhtmlArticle.readyState == 4 && xhtmlArticle.status == 200) {
                    var article = JSON.parse(xhtmlArticle.responseText);
                    addArticleToResult(article);
                }
            };

        }

        function sortResults(searchResult) {
            for (var i = 0; i < searchResult.results.length; i++) {
                retrieveArticles(searchResult.results[i]);
            }

            var suggestion = "";
            for (var j = 0; j < searchResult.spell.length; j++){
                suggestion += searchResult.spell[j][0] +" ";
            }
            suggestion = suggestion.slice(0, -1);
            if (suggestion != searchInput.value) {
                displayWordSuggestion(suggestion, 0)
            }
        }

    }
    else {
        wipeWordSuggestion();
        wipeResults();
        completeSearch = false;
    }
}

/**
 * Resets the search results
 */
function wipeResults() {
    searchResultHtml.innerHTML = "";
}

/**
 * Resets the word suggestion
 */
function wipeWordSuggestion() {
    document.getElementById("wordSuggestionField").innerHTML = "";
    currentSuggestion = "";
}

/**
 * Handles the logic around asking the search service for word suggestions and
 * providing displayWordSuggestion() with necessary info
 */
function wordSuggestion() {
    var searchServer = "http://despina.128.no/api/search";
    var searchWords = searchInput.value.split(" ");

    var searchWord = searchWords[searchWords.length -2];
    var searchLength = searchInput.value.length - searchWords[searchWords.length-1].length - searchWords[0].length;
    if (searchLength< 0){
        searchLength = 0;
    }

    var xhtmlSearch = new XMLHttpRequest();
    xhtmlSearch.open("post", searchServer, true);
    xhtmlSearch.send("{'Partial':'true', 'Query:'" + searchWord + "}");
    xhtmlSearch.onreadystatechange = function() {

        if (xhtmlSearch.readyState == 4 && xhtmlSearch.status == 200) {
            var results = JSON.parse(xhtmlSearch.responseText);
            displayWordSuggestion(results.spell[0][0], searchLength);
        }
    };
}


/**
 * Takes in a word and the current search length and provides a button for
 * suggesting a different word if it is a possibility that it is misspelled.
 * @param word
 * @param searchLength
 */
function displayWordSuggestion(word, searchLength) {
    currentSuggestion = word;
    //searchLength = searchLength - word.length;
    var suggestionField = document.getElementById("wordSuggestionField");
    if (word != "") {
        if (completeSearch) {
            suggestionField.innerHTML = "<button id='wordSuggestionButton' onclick='replaceWordSuggestion()'>"
                + "Mente du: " + word + " </button>";
        }
        else {
            suggestionField.innerHTML = "<button id='wordSuggestionButton' onclick='replaceWordSuggestion()'>"
                + word + " </button>";
        }
        var margin = 0;

        if (searchLength > word.length) {
            margin = (8.2 * searchLength) + 5;
            if (margin > 700) {
                margin = 700;  //prevents the suggestions from going out of the screen
            }
        }
        // Aligns the suggestion with where you are in the input field
        document.getElementById("wordSuggestionButton").style.marginLeft = margin + "px";
    }
    else {
        suggestionField.innerHTML = "";
    }
}

function replaceWordSuggestion() {
    if (completeSearch) {
        searchInput.value = "";
    }
    //Ignore the last element in the list because of the way split on " " generates an extra element
    if (currentSuggestion != "") {
        var searchWords = searchInput.value.split(" ");
        searchWords[searchWords.length - 2] = currentSuggestion;

        var newString = "";
        for (var i = 0; i < searchWords.length -1; i++) {
            newString += searchWords[i] + " ";
        }
        searchInput.value = newString;
        wipeWordSuggestion();
    }
}

/**
 * Takes in an article and adds it to the results in the view
 * @param article
 */
function addArticleToResult(article) {
    searchResultHtml.innerHTML +=
        '<div class="searchResult"> ' +
        '<a href=" ' + "http://despina.128.no/publish/article/" + article._id + ' "> ' +
        '<h3> ' + article.title + ' </h3> ' +
        '<p>' + article.description + ' </p> ' +
        '</a> ' +
        '</div>';
}
