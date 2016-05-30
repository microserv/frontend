import json
import logging
import requests
from django.http import HttpResponse, Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils import timezone
from requests.exceptions import ConnectionError as ReqConnectionError

NODE_ADDR = "http://127.0.0.1:9001"


def get_publisher_url():
    response_as_json = None
    try:
        r = requests.get(NODE_ADDR + "/" + "publishing")
        response_as_json = json.loads(r.text)
    except ReqConnectionError:
        return None

    return "http://" + response_as_json


def homepage(request):
    return render(request, "homepage.html", {})


def editor(request):
    logger = logging.getLogger(__name__)
    publisher_url = get_publisher_url()
    r = None
    try:
        request.COOKIES["next"] = "/editor/"
        r = requests.get(publisher_url + "/authorize_me", cookies=request.COOKIES)
    except ReqConnectionError:
        logger.error('Publisher offline when attempting to authorize %s.' % timezone.now())
    except TypeError:
        logger.error('Cannot retrieve publisher URL from backend communication service.')

    if r is None:
        return render(request, "editor_page.html", {})

    if r is not None and r.url != publisher_url + "/authorize_me":
        return HttpResponseRedirect(r.url)

    if r is not None and r.status_code == 200:
            return render(request, "editor_page.html", {})
    else:
        logger.debug('Something went very wrong. Check editor_backend/views.py "articles"-function.')
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')


def upload_article(request):

    if request.method != 'POST':
        return HttpResponse(status=405, content='Method not allowed.')

    article_title = request.POST.get('title', None)
    article_description = request.POST.get('description', None)
    article_content = request.POST.get('article', None)
    article_tags = request.POST.get('tags', None)

    if article_title is None or article_description is None or article_content is None:
        return HttpResponse(status=400, content='Bad Request. Make sure to fill out all required fields.')

    _article = {
        "tags": article_tags,
        "description": article_description,
        "title": article_title
    }

    _article["article"] = article_content.replace("src=\"//www.", "src=\"https://www.")

    publisher_url = get_publisher_url()

    if publisher_url:
        requests.post(publisher_url + "/save_article", data=_article, cookies=request.COOKIES)
    else:
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')

    return render(request, "editor_page.html", {})


def articles(request):
    logger = logging.getLogger(__name__)
    publisher_url = get_publisher_url()
    r = None
    try:
        request.COOKIES["next"] = "/articles/"
        r = requests.get(publisher_url + "/list", cookies=request.COOKIES)
    except ReqConnectionError:
        logger.error('Publisher offline during article listing at %s.' % timezone.now())
    except TypeError:
        logger.error('Cannot retrieve publisher URL from backend communication service.')

    if r is None:
        return render(request, "articles.html", {})

    if r is not None and r.url != publisher_url + "/list":
        return HttpResponseRedirect(r.url)

    json_response = r.json()
    if r is not None and r.status_code == 200 and json_response:
        return render(request, "articles.html", json_response)
    else:
        logger.debug('Something went very wrong. Check editor_backend/views.py "articles"-function.')
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')


def search(request):
    return render(request, "search.html", {})


def about(request):
    return render(request, "about.html", {})


def article(request, pk=None):
    logger = logging.getLogger(__name__)
    publisher_url = get_publisher_url()
    r = None

    if pk is None:
        return Http404

    try:
        r = requests.get(publisher_url + "/article_json/" + pk)
    except ReqConnectionError:
        logger.error('Publisher offline during request to fetch article "%s" at %s.' % (pk, timezone.now()))
    except TypeError:
        logger.error('Cannot retrieve publisher URL from backend communication service.')

    if r is None:
        return render(request, "article.html",
                      {'article': '<h1>Error</h1><p>The article resource is offline. Please try again later</p>'})

    if r.status_code == 404:
        raise Http404
    elif r.status_code != 200:
        logger.error('Response status code from upstream was %s, not 200 OK. Actual response:\n%s'
                     % (r.status_code, r.content))
        return render(request, "article.html",
                      {'article': '<h1>Error</h1><p>The article resource is offline. Please try again later</p>'})

    return render(request, "article.html", r.json())
