from django.shortcuts import render, redirect
import requests
from django.conf import settings
from django.contrib import messages
import json
from .models import Stock, Portfolio
from .forms import PortfolioCreateForm, PortfolioManageForm,WatchListManageForm
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from .serializers import PortfolioSerializer, StockSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


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
            return {'Error': 'There has been an unexpected issues. Please try again'}
    except Exception as e:
        return {'Error': 'There has been some connection error. Please try again later.'}
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


# DJANGO FORMS - CREATE/MANAGE PORTFOLIO
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
        else:
            messages.info(
                request, 'Currently, there are no stocks in your portfolio!')

        context = {
            'stockdata': zip(stockdata,userStock),
            'portfolio': portfolio,
        }
        return render(request, 'stocks/managePortfolio.html', context)


def stock_info(request,userStock_pk):

    ticker = Stock.objects.get(pk=userStock_pk)
    stockdata = history_data(ticker)
    context = {
        'stock': ticker,
        "stockdata": stockdata
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

# IMPLEMENTATION FOR FRONT-END
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def portfolio_create_form(request):
    if request.method == "POST":
        request.data['owner'] = request.user.id
        serialized = PortfolioSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_portfolio_list(request):
    if request.method == "GET":
        owner_id = request.user.id
        portfolios = Portfolio.objects.filter(owner_id=owner_id).order_by('id')
        serialized = PortfolioSerializer(portfolios, many=True)
        if serialized:
            return Response(serialized.data, status=HTTP_200_OK)
        else:
            return Response({"error": "something went wrong"}, status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_stock(request, portfolio_pk):
    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':
        ticker = request.data['ticker']

        if ticker:
            if check_stock_ticker_existed(ticker, portfolio):
                return Response({"error": f'{ticker} is already in Portfolio'}, status=HTTP_400_BAD_REQUEST)

            if check_valid_stock_ticker(ticker):
                # Watchlist stock: just add to portfolio and save
                if portfolio.stock_list:
                    portfolio.stock_list.append(f'{ticker}')
                else:
                    portfolio.stock_list = [f'{ticker}']
                portfolio.save()
                if portfolio.ptype == 'Transaction':
                    # Transaction stock: add to portfolio and save to db
                    request.data['portfolio'] = portfolio_pk
                    serializer = StockSerializer(data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                    return Response(serializer.data, status=HTTP_201_CREATED)
                return Response(status=HTTP_201_CREATED)
        return Response({"error": "Not a valid stock"}, status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stock_data(request, portfolio_pk):
    if request.method == "GET":
        portfolio = Portfolio.objects.get(pk=portfolio_pk)
        if portfolio.stock_list:
            # get data from api
            ticker_list = portfolio.stock_list
            tickers = ','.join(ticker_list)
            base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
            stock_data = search_stock_batch(base_url, tickers)
            data = []
            if portfolio.ptype == 'Transaction':
                for stock in stock_data:
                    # get data from db and combine, then send to front-end
                    stock_db = Stock.objects.get(ticker=stock['symbol'], portfolio_id=portfolio_pk)
                    data.append({
                        "symbol": stock["symbol"],
                        "companyName": stock["companyName"],
                        "latestPrice": stock["latestPrice"],
                        "previousClose": stock["previousClose"],
                        "changePercent": stock["changePercent"],
                        "quality": stock_db.quality,
                        "buyingPrice": stock_db.buying_price
                    })
            elif portfolio.ptype == 'Watchlist':
                for stock in stock_data:
                    # pick specific data we want to display and then send to front-end
                    data.append({
                        "symbol": stock["symbol"],
                        "companyName": stock["companyName"],
                        "latestPrice": stock["latestPrice"],
                        "changePercent": stock["changePercent"],
                        "previousClose": stock["previousClose"],
                        "marketCap": stock["marketCap"],
                        "ytdChange": stock["ytdChange"],
                        "peRatio": stock["peRatio"],
                        "week52High": stock["week52High"],
                        "week52Low": stock["week52Low"]
                    })
            if data and len(data) > 0:
                return Response(data, status=HTTP_200_OK)
        return Response({"error": "Currently, there are no stocks in your portfolio!"}, status=HTTP_400_BAD_REQUEST)
