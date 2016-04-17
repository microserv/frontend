from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context
from django.shortcuts import render
import json
import requests

publisher_url = "http://127.0.0.1:3000"

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
	
	r = requests.post(publisher_url+"/save_article", data = article)
	
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