from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib import messages
# Create your views here.
import requests
import json
import base64
from io import BytesIO
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
from .models import Stock
from .forms import StockForm


def box(title='IQ'):
    plt.figure(figsize=(9,6))
    time = ['09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30']
    high = [26.67,26.27,25.63,26.17,26.011,25.4,26.05,25.799,25.55,26.06,25.38,25.99,25.63,]
    low = [27.25,26.39,26.54,25.46,25.902,26.042,25.694,26.085,25.38,26.043,25.24,25.908,26.25]
    avg = [26.94,26.954,25.51,25.813,25.3,25.289,25.014,25.27,25.73,25.433,26.259,26.227,25.696]
    plt.stackplot(time,high,low,avg)
    plt.xlabel('time')
    plt.ylabel('Price(USD)')
    plt.title(title,fontsize = 18)
    plt.legend(['High','Low','Avg'],fontsize = 15)
    sio = BytesIO()
    plt.savefig(sio, format='png', bbox_inches='tight', pad_inches=0.0)
    data = base64.encodebytes(sio.getvalue()).decode()
    src = 'data:image/png;base64,' + str(data)
    plt.close()
    return src


def search_stock(url, stock_ticker):
    my_token = settings.IEXCLOUD_TEST_API_TOKEN
    complete_url = url + stock_ticker + '/quote?token=' + my_token
    #historical_data_url = url + stock_ticker + '/intraday?token=' + my_token
    data = requests.get(complete_url)
    #historical_data = requests.get(historical_data_url)
    #historical_data = json.loads(historical_data.content)
    #print(historical_data,file=open("output.txt","a+"))
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
    return data_list,box()


def check_valid_stock_ticker(stock_ticker):
    base_url = 'https://sandbox.iexapis.com/stable/stock/'
    stock = search_stock(base_url, stock_ticker)
    if 'Error' not in stock:
        return True
    return False


def check_stock_ticker_existed(stock_ticker):
    try:
        stock = Stock.objects.get(ticker=stock_ticker)
        if stock:
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


def portfolio(request):
    if request.method == 'POST':
        ticker = request.POST['ticker']
        if ticker:
            form = StockForm(request.POST or None)

            if form.is_valid():
                if check_stock_ticker_existed(ticker):
                    messages.warning(
                        request, f'{ticker} is already existed in Portfolio.')
                    return redirect('portfolio')

                if check_valid_stock_ticker(ticker):
                    #add stock
                    form.save()
                    messages.success(
                        request, f'{ticker} has been added successfully.')
                    return redirect('portfolio')

        messages.warning(request, 'Please enter a valid ticker name.')
        return redirect('portfolio')
    else:
        stockdata = Stock.objects.all()
        if stockdata:
            ticker_list = [stock.ticker for stock in stockdata]
            ticker_list = list(set(ticker_list))

            tickers = ','.join(ticker_list)
            base_url = 'https://sandbox.iexapis.com/stable/stock/market/batch?symbols='
            stockdata,context = search_stock_batch(base_url, tickers)
        else:
            messages.info(
                request, 'Currently, there are no stocks in your portfolio!')
        return render(request, 'stocks/portfolio.html', {'stockdata': stockdata,'src': context})


def delete_stock(request, stock_symbol):
    stock = Stock.objects.get(ticker=stock_symbol)
    stock.delete()

    messages.success(request, f'{stock.ticker} has been deleted successfully.')
    return redirect('portfolio')
