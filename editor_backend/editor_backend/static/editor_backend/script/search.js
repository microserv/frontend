

var loglevel = 0;
var searchResultHtml;
var searchInput;
var currentSuggestion = "";
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

    searchInput.addEventListener("keyup", keyboardHandler);
}

function keyboardHandler(e) {
    if (loglevel > 5) console.log("keyboardHandler");

    if (e.keyCode == 40) {replaceSuggestion();}
    else if (e.keyCode ==13) {console.log("This should force-search");}
    else {search();}

}

/**
 * TODO: Make this do a real search based on the content of searchInput
 */
function search() {
    if (loglevel > 5) console.log("search");
    if (searchInput.value != "") {
        console.log(searchInput.value + " This is a value")
        var results = [];

        /** TODO: What does partial really mean?
         * When do I know if its partial or not?
         * Can we just get one suggestion at a time ? last completed word probs from me
         *
         *
         */

        //todo: Send request to search with {'Partial':'true/false', 'Query':'string'}
        var fakeResultPartial = {'spell': [['jge', 'jeg'], ['er', 'er']]};

        wordSuggestion(fakeResultPartial.spell[fakeResultPartial.spell.length - 1][1], searchInput.value.length);


        // Splits the search and sends the current word and total search length to
        // the word suggestion function
        var searchWords = searchInput.value.split(" ");
        //wordSuggestion(searchWords[searchWords.length-1], searchInput.value.length);

        if (searchWords.length > 2){
            // TODO: Probs create a function for all this which can be force-called upon enter or search button
            wipeResults();
            //TODO: use the URIs to get the real articles
            results = {'spell': [['jge', 'jeg'], ['er', 'er']], 'results':['URI1', 'URI2', 'URI1' ]}.results;
            for (var i = 0; i < results.length; i++) {
                addArticleToResult(results[i]);
            }
        }
    }
    else {
        wipeWordSuggestion();
        wipeResults();
    }
}



function wipeResults() {
    if (loglevel > 5) console.log("wipeResults");
    searchResultHtml.innerHTML = "";
}


function wipeWordSuggestion() {
    if (loglevel > 5) console.log("wipeWordSuggestions");
    document.getElementById("wordSuggestionField").innerHTML ="";
    currentSuggestion = "";
}

/**
 * Takes in a word and the current search length and provides a button for
 * suggesting a different word if it is a possibility that it is misspelled.
 * @param word
 * @param searchLength
 */
function wordSuggestion(word, searchLength) {
    if (loglevel > 5) console.log("Word suggestion");
    currentSuggestion = word;
    searchLength = searchLength - word.length;
    var suggestionField = document.getElementById("wordSuggestionField");
    if (word != "") {
         suggestionField.innerHTML = "<button id='wordSuggestionButton' onclick='replaceSuggestion()'>"
             + word +" </button>";
        var margin = 0;

        if (searchLength > word.length ) {
            margin = (8.2 * searchLength) +5;
            if (margin > 700) {
                margin = 700;  //prevents the suggestions from going out of the screen
            }
        }
        // Aligns the suggestion with where you are in the input field
        document.getElementById("wordSuggestionButton").style.marginLeft =   margin + "px";
    }
    else {
        suggestionField.innerHTML = "";
    }
}

function replaceSuggestion() {
    if (loglevel > 5) console.log("replaceSuggestion");
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
    if (loglevel > 5) console.log("addArticleToResult");
    searchResultHtml.innerHTML +=
        '<div class="searchResult"> ' +
        '<a href=" '+ article.url+' "> ' +
        '<h3> ' + article.title + ' </h3> ' +
        '<p>' + article.desc + ' </p> ' +
        '</a> ' +
        '</div>';
}
