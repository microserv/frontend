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
 * TODO: Make this do a real search based on the content of searchInput
 */
function search() {
    if (searchInput.value != "") {
        completeSearch = true;

        //todo: Send request to search with {'Partial':'true/false', 'Query':'string'}


        // Splits the search and sends the current word and total search length to
        // the word suggestion function
        var searchWords = searchInput.value.split(" ");
        //wordSuggestion(searchWords[searchWords.length-1], searchInput.value.length);

        // TODO: Probs create a function for all this which can be force-called upon enter or search button
        wipeResults();
        //TODO: use the URIs to get the real articles

        var searchResult = {'spell': [['jge', 'jeg'], ['er', 'er']], 'results': ['URI1', 'URI2', 'URI1']};
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
    else {
        wipeWordSuggestion();
        wipeResults();
        completeSearch = false;
    }
}


function wipeResults() {
    searchResultHtml.innerHTML = "";
}


function wipeWordSuggestion() {
    document.getElementById("wordSuggestionField").innerHTML = "";
    currentSuggestion = "";
}


function wordSuggestion() {
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
    searchResultHtml.innerHTML +=
        '<div class="searchResult"> ' +
        '<a href=" ' + article.url + ' "> ' +
        '<h3> ' + article.title + ' </h3> ' +
        '<p>' + article.desc + ' </p> ' +
        '</a> ' +
        '</div>';
}
