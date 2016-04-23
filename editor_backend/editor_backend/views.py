from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context
from django.shortcuts import render
import json
import requests

NODE_ADDR = "http://127.0.0.1:9001"

def get_publisher_url():
	r = requests.get(NODE_ADDR + "/" + "publish")
	response_as_json = json.loads(r.text)
	if response_as_json:
		return response_as_json
	else:
		return None

def homepage(request):
	return render(request, "homepage.html", {});

def editor(request):	
	return render(request, "editor_page.html", {});
	
def upload_article(request):
	dict = request.POST.dict()
	
	article = {"tags": dict["tags"], "description": dict["description"], "title": dict["title"]}
	
	article_start = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>"
	article_mid = "</title></head><body>"
	article_end = "</body></html>"
	article["article"] = article_start + dict["title"] + article_mid + dict["article"].replace("src=\"//www.", "src=\"http://www.") + article_end
	
	if "index" in dict:
		article["index"] = "on"
	else:
		article["index"] = "off"
	
	publisher_url = get_publisher_url()
        if publisher_url:
            r = requests.post("http://"+publisher_url+"/save_article", data = article)
        else:
            # Do some error handling here.
            pass
	
	#js = json.dumps(article)
	#jf = open('js.json', 'w')
	#jf.write(js)
	#jf.close()
	
	return render(request, "editor_page.html", {});

def articles(request):
	r = requests.get(publisher_url+"/list")
	d = r.json()
	d["publisher_url"] = publisher_url
	return render(request, "articles.html", d);

def search(request):
    return render(request, "search.html", {});


def about(request):
    return render(request, "about.html", {});
