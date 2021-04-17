from django.shortcuts import render, redirect
import requests
from django.conf import settings
from django.contrib import messages
import json
from .models import Stock, Portfolio
from .forms import PortfolioCreateForm, PortfolioManageForm,WatchListManageForm
from django.urls import reverse
from django.http import HttpResponseRedirect
from .price_prediction import prediction
import pandas as pd

#news sentiment
from .news_sentiment import analyse_news_sentiment, predict_rating

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


def search_stock_batch(base_url, stock_tickers):
    data_list = []

    try:
        token = settings.IEXCLOUD_TEST_API_TOKEN
        url = base_url + stock_tickers + '&types=quote&token=' + token
        data = requests.get(url)

        if data.status_code == 200:
            data = json.loads(data.content)
            for item in data:
                data_list.append(data[item]['quote'])
        else:
            data = {'Error': 'There has been an unexpected issues. Please try again'}
    except Exception as e:
        data = {
            'Error': 'There has been some connection error. Please try again later.'}
    return data_list


def check_valid_stock_ticker(stock_ticker):
    base_url = 'https://sandbox.iexapis.com/stable/stock/'
    stock = search_stock(base_url, stock_ticker)
    if 'Error' not in stock:
        return True
    return False


def check_stock_ticker_existed(stock_ticker,portfolio):
    try:
        stockdata = portfolio.stock_list
        if portfolio.stock_list:
            ticker_list = portfolio.stock_list
            if stock_ticker in ticker_list:
                return True
    except Exception:
        return False

def home(request):
    if request.method == 'POST':
        stock_ticker = request.POST['stock_ticker']
        url = 'https://sandbox.iexapis.com/stable/stock/'
        stocks = search_stock(url, stock_ticker)
        return render(request, 'stocks/home.html', {'stocks': stocks})
    return render(request, 'stocks/home.html')


def watchList_manage_form(request, portfolio_pk):

    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':
        if 'add_stock' in request.POST:
            ticker = request.POST['ticker']
            form = WatchListManageForm(request.POST or None)

            if form.is_valid():
                
                if check_stock_ticker_existed(ticker,portfolio):
                    messages.warning(
                        request, f'{ticker} is already existed in Portfolio.')
                    return HttpResponseRedirect("") 

                if check_valid_stock_ticker(ticker):
                    if portfolio.stock_list:
                        portfolio.stock_list.append(f'{ticker}')
                    else:
                        portfolio.stock_list = [f'{ticker}']
                    portfolio.save()
                    form = form.save(commit=False)
                    form.portfoilo = portfolio
                    form.save()
                    messages.success(
                        request, f'{ticker} has been added successfully.')
                    return HttpResponseRedirect("") 

        elif 'remove_stock' in request.POST: 
            ticker = str(request.POST.get('stock_symbol')).lower()
            portfolio.stock_list.remove(ticker)
            portfolio.save()
            return HttpResponseRedirect("") 
        messages.warning(request, 'Please enter a valid ticker name.')
        return HttpResponseRedirect("") 

    else:
        userStock = list(Stock.objects.filter(portfoilo=portfolio_pk))
        stockdata = portfolio.stock_list

        if portfolio.stock_list:
            ticker_list = portfolio.stock_list

            tickers = ','.join(ticker_list)
            base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
            stockdata = search_stock_batch(base_url, tickers)
        else:
            messages.info(
                request, 'Currently, there are no stocks in your portfolio!')

        context = {
            'stockdata': zip(stockdata,userStock),
            'portfolio': portfolio,
        }
        return render(request, 'stocks/manageWatchList.html', context)


def portfolio_create_form(request):

    portfolio_list = Portfolio.objects.all()
    form = PortfolioCreateForm()
    if request.method == "POST":
        form = PortfolioCreateForm(request.POST or None)
        if form.is_valid():
            form = form.save(commit=False)
            #form.stock_list = [99]
            form.save()
            if form.ptype == "WatchList":
                return redirect(reverse('stocks:manageWatchList', args=[form.pk]))
            elif form.ptype == "Portfolio":
                return redirect(reverse('stocks:managePortfolio', args=[form.pk]))


    context = {
        'portfolio_list': portfolio_list,
        'form':form
    }
    return render(request, 'stocks/createPortfolio.html',context)


def portfolio_manage_form(request,portfolio_pk):
    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':

        if 'add_stock' in request.POST:
            ticker = request.POST['ticker']
            quality = request.POST['quality']
            buying_price = request.POST['buying_price']
            form = PortfolioManageForm(request.POST or None)

            if form.is_valid():
                
                if check_stock_ticker_existed(ticker,portfolio):
                    messages.warning(
                        request, f'{ticker} is already existed in Portfolio.')
                    return HttpResponseRedirect("") 

                if check_valid_stock_ticker(ticker):
                    if portfolio.stock_list:
                        portfolio.stock_list.append(f'{ticker}')
                    else:
                        portfolio.stock_list = [f'{ticker}']
                    portfolio.save()
                    form = form.save(commit=False)
                    form.portfoilo = portfolio
                    form.save()
                    messages.success(
                        request, f'{ticker} has been added successfully.')
                    return HttpResponseRedirect("") 

        elif 'remove_stock' in request.POST: 
            ticker = str(request.POST.get('stock_symbol')).lower()
            portfolio.stock_list.remove(ticker)
            portfolio.save()
            return HttpResponseRedirect("") 

        else:
            messages.warning(request, 'Please enter a valid ticker name.')
            return HttpResponseRedirect("") 

    
    else:
        userStock = list(Stock.objects.filter(portfoilo=portfolio_pk))
        stockdata = portfolio.stock_list

        if portfolio.stock_list:
            ticker_list = portfolio.stock_list
    
            tickers = ','.join(ticker_list)
            base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
            stockdata = search_stock_batch(base_url, tickers)

            df_news = analyse_news_sentiment(ticker_list)
            json_records = df_news.reset_index().to_json(orient='records')
            news_data = []
            news_data = json.loads(json_records)
            context = {
                'stockdata': zip(stockdata, userStock),
                'portfolio': portfolio,
                'news_sentiment': news_data,
                #'user_stocks':user_stock
            }
        else:
            messages.info(
                request, 'Currently, there are no stocks in your portfolio!')

            context = {
                'stockdata': zip(stockdata,userStock),
                'portfolio': portfolio,
                #'user_stocks':user_stock
            }
        return render(request, 'stocks/managePortfolio.html', context)

def stock_info(request,userStock_pk):

    ticker = Stock.objects.get(pk=userStock_pk)
    stockdata = history_data(ticker)
    predicted_price = prediction(history_data(ticker,'1y'))
    context = {
        'stock': ticker,
        "stockdata": stockdata,
        "predicted_price": predicted_price
    }
    return render(request, 'stocks/stockInfo.html',context)


def history_data(ticker, range='1d'):
    if range not in ['1d', '5d', '1m', '6m', 'ytd', '1y', '5y']:
        return False
    else:
        my_token = settings.IEXCLOUD_TEST_API_TOKEN
        base_url = "https://sandbox.iexapis.com/stable/stock/"
        url = base_url + str(ticker) + "/chart/" + range + "?token=" + my_token
        data = requests.get(url)

        if data.status_code == 200:
            data = json.loads(data.content)
        else:
            data = {
                'Error': 'There was a problem with your provided ticker symbol. Please try again'}

        return data
