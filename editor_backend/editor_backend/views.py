import json
import requests
from django.http import HttpResponse, Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render
from requests.exceptions import ConnectionError as ReqConnectionError

NODE_ADDR = "http://127.0.0.1:9001"
publish_base_url = "http://despina.128.no/publish"


def get_publisher_url():
    response_as_json = None
    try:
        r = requests.get(NODE_ADDR + "/" + "publishing")
        response_as_json = json.loads(r.text)
    except ReqConnectionError:
        return None

    return response_as_json


def homepage(request):
    return render(request, "homepage.html", {})


def editor(request):
    return render(request, "editor_page.html", {})


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
        "title": article_tags
    }

    _article["article"] = article_content.replace("src=\"//www.", "src=\"http://www.")

    publisher_url = get_publisher_url()

    if publisher_url:
        requests.post("http://" + publisher_url + "/save_article", data=_article)
    else:
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')

    return render(request, "editor_page.html", {})


def articles(request):
    try:
        r = requests.get(publish_base_url + "/list")
    except ReqConnectionError:
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')

    if r.url != publish_base_url + "/list":
        return HttpResponseRedirect(r.url)

    json_response = r.json()
    if r.status_code == 200 and json_response:
        return render(request, "articles.html", json_response)
    else:
        print(r)


def search(request):
    return render(request, "search.html", {})


def about(request):
    return render(request, "about.html", {})


def article(request, pk=None):
    if pk is None:
        return Http404

    try:
        r = requests.get(publish_base_url + "/article_json/" + pk)
    except ReqConnectionError:
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')

    if r.status_code != 200:
        return HttpResponse(status=500, content='Internal Server Error. Please try again later.')

    return render(request, "article.html", r.json())
