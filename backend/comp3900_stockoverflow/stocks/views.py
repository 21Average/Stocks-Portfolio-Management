from django.shortcuts import render
from django.conf import settings
# Create your views here.
import requests
import json

def search_stock(url, stock_ticker):
    my_token = settings.IEXCLOUD_TEST_API_TOKEN
    complete_url = url + stock_ticker + '/quote?token=' + my_token
    data = requests.get(complete_url)

    if data.status_code == 200:
        data = json.loads(data.content)
    else:
        data = {
            'Error': 'There was a problem with your provided ticker symbol. Please try again'}

    return data

def home(request):
    if request.method == 'POST':
        stock_ticker = request.POST['stock_ticker']
        url = 'https://sandbox.iexapis.com/stable/stock/'
        stocks = search_stock(url, stock_ticker)
        return render(request, 'stocks/home.html', {'stocks': stocks})
    return render(request, 'stocks/home.html')
