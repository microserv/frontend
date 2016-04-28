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


        //var searchResult = {'spell': [['jge', 'jeg'], ['er', 'er']], 'results': ['URI1', 'URI2', 'URI1']};
        var xhtmlSearch = new XMLHttpRequest();
        xhtmlSearch.open("post", searchServer, true);
        xhtmlSearch.send("{'Partial':'false', 'Query:'" + searchInput.value + "}");
        xhtmlSearch.onreadystatechange = function() {

            if (xhtmlSearch.readyState == 4 && xhtmlSearch.status == 200) {
                console.log(xhtmlSearch.responseText);
                var results = JSON.parse(xhtmlSearch.responseText);
                for (var i = 0; i< results.results.length; i++){
                    retrieveArticles(results.results[i]);
                }
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
                else {
                    console.log("article: " + xhtmlArticle.readyState + " : " + xhtmlArticle.status )
                }
            };

        }

        function sortResults(searchResult) {

            for (var i = 0; i < searchResult.results.length; i++) {
                addArticleToResult(searchResult.results[i]);
            }

            var suggestion = "";
            for (var j = 0; j < searchResult.spell.length; j++){
                suggestion += searchResult.spell[j][1] +" ";
            }
            suggestion = suggestion.slice(0, -1);
            if (suggestion.split(" ") != searchWords) {
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

    // TODO: Make this load real suggestions
    var fakeResultPartial = {'spell': [['jge', 'jeg'], ['er', 'er']]};
    var tempWord = fakeResultPartial.spell[fakeResultPartial.spell.length - 1][1];
    var searchLength = searchInput.value.length - tempWord.length;

    displayWordSuggestion(tempWord, searchLength);
}


/**
 * Takes in a word and the current search length and provides a button for
 * suggesting a different word if it is a possibility that it is misspelled.
 * @param word
 * @param searchLength
 */
function displayWordSuggestion(word, searchLength) {
    currentSuggestion = word;
    searchLength = searchLength - word.length;
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
    if (currentSuggestion != "") {
        var searchWords = searchInput.value.split(" ");
        searchWords[searchWords.length - 1] = currentSuggestion;

        var newString = "";
        for (var i = 0; i < searchWords.length; i++) {
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
    console.log("addArticle")
    searchResultHtml.innerHTML +=
        '<div class="searchResult"> ' +
        '<a href=" ' + "http://despina.128.no/publish/article/" + article._id + ' "> ' +
        '<h3> ' + article.title + ' </h3> ' +
        '<p>' + article.description + ' </p> ' +
        '</a> ' +
        '</div>';
}
