from django.shortcuts import render, redirect
import requests
from django.conf import settings
from django.contrib import messages
import json
from .models import Stock, Portfolio
from .forms import PortfolioCreateForm, PortfolioManageForm, WatchListManageForm
from django.urls import reverse
from django.http import HttpResponseRedirect
from .serializers import PortfolioSerializer, StockSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime, timedelta
from .price_prediction import prediction
import pandas as pd
# news sentiment
from .news_sentiment import analyse_news_sentiment, predict_rating
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


def search_stock_price(ticker):
    my_token = settings.IEXCLOUD_TEST_API_TOKEN
    url = "https://sandbox.iexapis.com/stable/stock/" + ticker + "/quote/latestPrice?token=" + my_token
    data = requests.get(url)

    if data.status_code == 200:
        data = json.loads(data.content)
    else:
        data = ''
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


def check_stock_ticker_existed(stock_ticker, portfolio):
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


def convert_date_to_timestamp(date_val, time_val):
    y, m, d = date_val.split('-')
    h, mi = time_val.split(':')
    dt = datetime(int(y), int(m), int(d), int(h), int(mi))
    return dt.timestamp()


# DJANGO FORM IMPLEMENTATION
def watchList_manage_form(request, portfolio_pk):
    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':
        if 'add_stock' in request.POST:
            ticker = request.POST['ticker']
            form = WatchListManageForm(request.POST or None)

            if form.is_valid():

                if check_stock_ticker_existed(ticker, portfolio):
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
                    form.portfolio = portfolio
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
        userStock = list(Stock.objects.filter(portfolio=portfolio_pk))
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
            'stockdata': zip(stockdata, userStock),
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
            portfolio_pk = request.POST.get('portfolio_pk')
            Portfolio.objects.filter(id=portfolio_pk).delete()
            return HttpResponseRedirect("")

    context = {
        'portfolio_list': portfolio_list,
        'form': form
    }
    return render(request, 'stocks/createPortfolio.html', context)


def portfolio_manage_form(request, portfolio_pk):
    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':

        if 'add_stock' in request.POST:
            ticker = (request.POST['ticker']).upper()
            quality = request.POST['quality']
            buying_price = request.POST['buying_price']
            form = PortfolioManageForm(request.POST or None)
            if form.is_valid():

                if check_stock_ticker_existed(ticker, portfolio):
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
                    form.portfolio = portfolio
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
                        form.portfolio = portfolio
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
        userStock = list(Stock.objects.filter(portfolio=portfolio_pk))
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
                    user_stock.profit = (decimal.Decimal(
                        stock['latestPrice']) - user_stock.buying_price) * user_stock.quality

        context = {
            'stockdata': userStock,
            'portfolio': portfolio,
            'stock_list': stock_list
        }
        return render(request, 'stocks/managePortfolio.html', context)


def stock_info(request, userStock_pk):
    ticker = Stock.objects.get(pk=userStock_pk)
    stockdata = history_data(ticker)
    predicted_price = prediction(history_data(ticker, '1y'))
    context = {
        'stock': ticker,
        "stockdata": stockdata,
        "predicted_price": predicted_price
    }
    return render(request, 'stocks/stockInfo.html', context)


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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_portfolio(request):
    if request.method == "POST":
        if Portfolio.objects.filter(name=request.data['name'], owner_id=request.user.id).exists():
            return Response({'error': 'Portfolio name already taken!'}, status=HTTP_400_BAD_REQUEST)
        request.data['owner'] = request.user.id
        serialized = PortfolioSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_portfolios(request):
    if request.method == "DELETE":
        portfolios = request.data['portfolios']
        for port_name in portfolios:
            portfolio = Portfolio.objects.get(name=port_name, owner_id=request.user.id)
            if portfolio.ptype == "Transaction":
                for stock in portfolio.stock_list:
                    stock_objs = Stock.objects.filter(ticker=stock, portfolio_id=portfolio.id)
                    stock_objs.delete()
            portfolio.delete()
        return Response({"success": "Portfolio deleted"}, status=HTTP_200_OK)
    return Response({"error": "Could not delete profile"}, status=HTTP_400_BAD_REQUEST)


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
            return Response(serialized.errors, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_portfolios_summary(request):
    if request.method == "GET":
        data = []
        owner_id = request.user.id
        portfolios = Portfolio.objects.filter(owner_id=owner_id, ptype='Transaction').order_by('id')
        for portfolio in portfolios:
            if portfolio.stock_list:
                tickers = ','.join(portfolio.stock_list)
                base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
                stock_data = search_stock_batch(base_url, tickers)
                total_gain_loss = 0
                num_stocks = len(portfolio.stock_list)
                for stock in stock_data:
                    # get data from db and combine with data pulled from api
                    stocks_db = Stock.objects.filter(ticker=stock["symbol"], portfolio_id=portfolio.id)
                    if len(stocks_db) > 0:
                        for s in stocks_db:
                            # re-calculate profit from stock's latest price
                            profit = round(((decimal.Decimal(stock["latestPrice"]) - s.buying_price) * s.quality),
                                           2)
                            total_gain_loss += profit
                    elif len(stocks_db) == 1:
                        # re-calculate profit from stock's latest price
                        profit = round(((decimal.Decimal(stock["latestPrice"]) - stocks_db[0].buying_price) * stocks_db[
                            0].quality), 2)
                        total_gain_loss += profit
                data.append({
                    "name": portfolio.name,
                    "numStocks": num_stocks,
                    "totalGL": total_gain_loss,
                    "stocks": portfolio.stock_list
                })
        if data and len(data) > 0:
            return Response(data, status=HTTP_200_OK)
        else:
            return Response({"error": "Could not retrieve portfolios summary"}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_stock(request, portfolio_pk):
    portfolio = Portfolio.objects.get(pk=portfolio_pk)
    if request.method == 'POST':
        ticker = request.data['ticker']
        if ticker:
            if check_stock_ticker_existed(ticker, portfolio):
                return Response({"error": f'{ticker} is already in your portfolio'}, status=HTTP_400_BAD_REQUEST)
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
                    stock_price = search_stock_price(ticker)
                    buying_price = decimal.Decimal(request.data["buying_price"])
                    quantity = int(request.data["quality"])
                    if not stock_price:
                        return Response(stock_price, status=HTTP_400_BAD_REQUEST)
                    request.data['profit'] = round(
                        ((decimal.Decimal(stock_price) - buying_price) * quantity), 2)
                    serializer = StockSerializer(data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=HTTP_201_CREATED)
                    else:
                        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
                return Response(status=HTTP_201_CREATED)
        return Response({"error": "Not a valid stock"}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_stock_data(request):
    stock_id = request.data['stock_id']
    try:
        stock = Stock.objects.get(id=stock_id)
        ticker = stock.ticker
    except ValueError:
        ticker = stock_id
    base_url = 'https://sandbox.iexapis.com/stable/stock/'
    stock = search_stock(base_url, ticker)
    if 'Error' in stock:
        return Response(stock, status=HTTP_400_BAD_REQUEST)
    else:
        # select data to send
        data = {
            "id": stock_id,
            "symbol": stock["symbol"],
            "companyName": stock["companyName"],
            "latestPrice": stock["latestPrice"],
            "previousClose": stock["previousClose"],
            "changePercent": stock["changePercent"],
            "marketCap": stock["marketCap"],
            "ytdChange": stock["ytdChange"],
            "peRatio": stock["peRatio"],
            "week52High": stock["week52High"],
            "week52Low": stock["week52Low"]
        }
        return Response(data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_stock_recommendation(request):
    stock_id = request.data['stock_id']
    try:
        stock = Stock.objects.get(id=stock_id)
        ticker = stock.ticker
    except ValueError:
        ticker = stock_id
    # Recommendation part
    stock_data = history_data(ticker)
    predicted_price = prediction(history_data(ticker, '1y'))
    predicted_1m = predicted_price[29]
    price_yes = stock_data[0]['close']
    if price_yes is not None:
        if (predicted_1m / price_yes) - 1 < 0.1:
            recommendation = "Recommended to Sell"
        else:
            recommendation = "Recommended to Buy"
    else:
        recommendation = ""

    if recommendation:
        return Response({"recommendation": recommendation}, status=HTTP_200_OK)
    else:
        return Response({"recommendation": recommendation}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_stock_history(request):
    if request.method == "POST":
        stock_id = request.data['stock_id']
        try:
            stock = Stock.objects.get(id=stock_id)
            ticker = stock.ticker
        except ValueError:
            ticker = stock_id
        time_interval = request.data['range']
        # only send date, close, volume
        close_data, volume_data, data = [], [], {}
        try:
            history = history_data(ticker=ticker, range=time_interval)
        except Exception:
            return Response({"error": "Could not retrieve stock history"}, status=HTTP_400_BAD_REQUEST)
        for i, value in enumerate(history):
            close_data.append({
                "time": value["date"],
                "value": value["close"],
            })
            volume_data.append({
                "time": value["date"],
                "value": value["volume"],
            })
            if time_interval == '1d':  # using intra-day values, need to convert to UTC timestamp
                timestamp = convert_date_to_timestamp(date_val=value["date"], time_val=value["minute"])
                close_data[i]["time"] = timestamp
                volume_data[i]["time"] = timestamp
        if close_data and len(close_data) > 0:
            data["close_data"] = close_data
        if volume_data and len(volume_data) > 0:
            data["volume_data"] = volume_data
        if data and len(data) > 0:
            return Response(data, status=HTTP_200_OK)
    return Response({"error": "Could not retrieve stock history"}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_stock_prediction(request):
    if request.method == "POST":
        close_data, prediction_data, data = [], [], {}
        stock_id = request.data['stock_id']
        try:
            stock = Stock.objects.get(id=stock_id)
            ticker = stock.ticker
        except ValueError:
            ticker = stock_id
        history = history_data(ticker=ticker, range='1y')
        for h in history:
            close_data.append({
                "time": h["date"],
                "value": h["close"],
            })
        try:
            price_prediction = prediction(history)
        except IndexError:
            return Response({"error": "Could not retrieve stock price prediction"}, status=HTTP_400_BAD_REQUEST)
        for i, p in enumerate(price_prediction):
            curr_date = datetime.now().date() + timedelta(days=i)
            prediction_data.append({
                "time": curr_date,
                "value": p,
            })
        if close_data and len(close_data) > 0 and prediction_data and len(prediction_data) > 0:
            data['close_data'] = close_data
            data['prediction_data'] = prediction_data
        if data and len(data) > 0:
            return Response(data, status=HTTP_200_OK)
    return Response({"error": "Could not retrieve stock price prediction"}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_stock_news(request):
    if request.method == "POST":
        news = request.data['news']
        newsToSend = []
        for i, article in enumerate(news):
            rating = predict_rating(article['title'])
            if rating:
                newsToSend.append(news[i])
                newsToSend[i]['rating'] = rating
            else:
                newsToSend.append(news[i])
                newsToSend[i]['rating'] = ''

        if newsToSend and len(newsToSend) > 0:
            return Response(newsToSend, status=HTTP_200_OK)
    return Response({"error": "Could not retrieve stock-related news"}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_stock_share(request, portfolio_pk):
    if request.method == "POST":
        action = request.data['action']
        stock_id = request.data['stock_id']
        try:
            stock = Stock.objects.get(id=stock_id)
            ticker = stock.ticker
        except ValueError:
            ticker = stock_id
        portfolio = Portfolio.objects.get(id=portfolio_pk)
        quantity = int(request.data['quantity'])
        stock_price = search_stock_price(ticker)
        if not stock_price:
            return Response(stock_price, status=HTTP_400_BAD_REQUEST)
        # update stock
        if action:
            if action == 'buy':
                new_buying_price = decimal.Decimal(request.data['buying_price'])
                profit = round(((decimal.Decimal(stock_price) - new_buying_price) * quantity), 2)
                Stock.objects.create(ticker=ticker, quality=quantity, profit=profit, buying_price=new_buying_price,
                                     portfolio=portfolio)
                portfolio.stock_list.append(ticker)
                portfolio.save()
            elif action == 'sell':
                new_quantity = stock.quality - quantity
                stock.quality = new_quantity
                stock.profit = round(((decimal.Decimal(stock_price) - stock.buying_price) * new_quantity), 2)
                stock.save()
            return Response(status=HTTP_200_OK)
        else:
            return Response({"error": "Invalid action. Needs to be 'buy' or 'sell'"}, status=HTTP_400_BAD_REQUEST)
    return Response({"error": "Failed to update stock"}, status=HTTP_400_BAD_REQUEST)


def get_transaction_stock_data(stock_from_db, stock_from_api):
    profit = round(
        ((decimal.Decimal(stock_from_api["latestPrice"]) - stock_from_db.buying_price) * stock_from_db.quality), 2)
    return {
        "id": stock_from_db.id,
        "symbol": stock_from_api["symbol"],
        "companyName": stock_from_api["companyName"],
        "latestPrice": stock_from_api["latestPrice"],
        "previousClose": stock_from_api["previousClose"],
        "changePercent": stock_from_api["changePercent"],
        "quality": stock_from_db.quality,
        "buyingPrice": stock_from_db.buying_price,
        "profit": profit
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_stock_data(request, portfolio_pk):
    if request.method == "GET":
        portfolio = Portfolio.objects.get(pk=portfolio_pk)
        if portfolio.stock_list:
            # get data from api
            ticker_list = portfolio.stock_list
            tickers = ','.join(ticker_list)
            base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
            stock_batch_data = search_stock_batch(base_url, tickers)
            data = []
            for stock in stock_batch_data:
                stock_db = Stock.objects.filter(ticker=stock['symbol'], portfolio_id=portfolio_pk)
                if portfolio.ptype == 'Transaction':  # get data from db and combine with data pulled from api
                    if len(stock_db) > 1:
                        for s in stock_db:
                            # re-calculate profit from stock's latest price
                            stock_data = get_transaction_stock_data(s, stock)
                            data.append(stock_data)
                    elif len(stock_db) == 1:
                        stock_data = get_transaction_stock_data(stock_db[0], stock)
                        data.append(stock_data)
                elif portfolio.ptype == 'Watchlist':
                    # pick specific data we want to display and then send to front-end
                    data.append({
                        "symbol": stock["symbol"],
                        "companyName": stock["companyName"],
                        "latestPrice": stock["latestPrice"],
                        "previousClose": stock["previousClose"],
                        "changePercent": stock["changePercent"],
                        "marketCap": stock["marketCap"],
                        "ytdChange": stock["ytdChange"],
                        "peRatio": stock["peRatio"],
                        "week52High": stock["week52High"],
                        "week52Low": stock["week52Low"]
                    })
            if data and len(data) > 0:
                return Response(data, status=HTTP_200_OK)
        return Response({"error": "Currently, there are no stocks in your portfolio!"}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_latest_stock_news(request):
    key = settings.FMP_API
    url = "https://financialmodelingprep.com/api/v3/stock_news?" + "&limit=50&apikey=" + key
    data = requests.get(url)
    if data.status_code == 200:
        data = json.loads(data.content)
        return Response(data, status=HTTP_200_OK)
    else:
        return Response({"error": "Could not retrieve latest news"}, status=HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_stock(request, portfolio_pk):
    if request.method == "DELETE":
        stocks = request.data['stocks']
        if stocks:
            for stock in stocks:
                s_id, name = stock.split(':')
                # delete from stock_list in Portfolio table
                portfolio = Portfolio.objects.get(pk=portfolio_pk)
                stock_list = portfolio.stock_list
                if stock_list:
                    stock_list.remove(name)
                    portfolio.save()
                # delete stock from Stock table if Transaction portfolio
                if portfolio.ptype == "Transaction":
                    stock = Stock.objects.get(id=s_id)
                    stock.delete()
            return Response({"success": "Stock removed"}, status=HTTP_200_OK)
        return Response({"error": "Could not delete stocks"}, status=HTTP_400_BAD_REQUEST)
