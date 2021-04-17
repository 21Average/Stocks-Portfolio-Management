from django.shortcuts import render, redirect
import requests
from django.conf import settings
from django.contrib import messages
import json
from .models import Stock, Portfolio
from .forms import PortfolioCreateForm, PortfolioManageForm,WatchListManageForm
from django.urls import reverse
from django.http import HttpResponseRedirect
import decimal

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
                
                else:
                    messages.warning(request, 'Please enter a valid ticker name.')
                    return HttpResponseRedirect("") 
                    
        elif 'remove_stock' in request.POST: 
            ticker = str(request.POST.get('stock_symbol')).lower()
            portfolio.stock_list.remove(ticker)
            portfolio.save()
            stock_pk = request.POST.get('stock_id')
            Stock.objects.filter(id=stock_pk).delete()
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
        if 'add_portfolio' in request.POST:
            form = PortfolioCreateForm(request.POST or None)
            if form.is_valid():
                form = form.save(commit=False)
                
                form.save()
                if form.ptype == "WatchList":
                    return redirect(reverse('stocks:manageWatchList', args=[form.pk]))
                elif form.ptype == "Portfolio":
                    return redirect(reverse('stocks:managePortfolio', args=[form.pk]))

        elif 'remove_portfolio' in request.POST: 
            portfolio_pk= request.POST.get('portfolio_pk')
            Portfolio.objects.filter(id=portfolio_pk).delete()
            return HttpResponseRedirect("")

    context = {
        'portfolio_list': portfolio_list,
        'form':form
    }
    return render(request, 'stocks/createPortfolio.html',context)


def portfolio_manage_form(request,portfolio_pk):
    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':

        if 'add_stock' in request.POST:
            ticker = (request.POST['ticker']).upper()
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

                else:
                    messages.warning(request, 'Please enter a valid ticker name.')
                    return HttpResponseRedirect("") 

        elif 'remove_stock' in request.POST: 
            ticker = str(request.POST.get('stock_symbol'))
            portfolio.stock_list.remove(ticker)
            portfolio.save()
            stock_pk = request.POST.get('stock_id')
            Stock.objects.filter(id=stock_pk).delete()
            return HttpResponseRedirect("")

        elif 'buy_stock' in request.POST:
            ticker = str(request.POST.get('ticker'))
            quality = request.POST['quality']
            buying_price = request.POST['buying_price']
            int_quality = int(quality)
            int_buying_price = '%.2f' % float(buying_price)
            stock_pk = request.POST.get('stock_id')
            stock = Stock.objects.filter(id=stock_pk).get()

            if '%.2f' % stock.buying_price == int_buying_price:
                newquality = stock.quality + int_quality
                stock.quality = newquality
                stock.save()
            else:
                form = PortfolioManageForm(request.POST or None)
                if form.is_valid():
                    form.ticker = ticker
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

        elif 'sell_stock' in request.POST:
            ticker = str(request.POST.get('ticker'))
            quality = request.POST['quality']
            int_quality = int(quality)
            stock_pk = request.POST.get('stock_id')
            stock = Stock.objects.filter(id=stock_pk).get()

            newquality = stock.quality - int_quality
            stock.quality = newquality
            stock.save()

            return HttpResponseRedirect("")
               

    else:
        userStock = list(Stock.objects.filter(portfoilo=portfolio_pk))
        stock_list = portfolio.stock_list

        if portfolio.stock_list:
            ticker_list = portfolio.stock_list
            tickers = ','.join(ticker_list)
            base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
            stock_list = search_stock_batch(base_url, tickers)
        else:
            messages.info(
                request, 'Currently, there are no stocks in your portfolio!')

        for user_stock in userStock:
            for stock in stock_list:
                if stock['symbol'] == user_stock.ticker:
                    user_stock.profit = (decimal.Decimal(stock['latestPrice'])-user_stock.buying_price) * user_stock.quality

        context = {
            'stockdata': userStock,
            'portfolio': portfolio,
            'stock_list':stock_list
        }
        return render(request, 'stocks/managePortfolio.html', context)

def stock_info(request,userStock_pk):

    ticker = Stock.objects.get(pk=userStock_pk)

    context = {
        'stock': ticker,
    }
    return render(request, 'stocks/stockInfo.html',context)

