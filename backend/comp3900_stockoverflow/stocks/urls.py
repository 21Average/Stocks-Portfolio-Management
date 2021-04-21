from django.urls import path, re_path
from .views import portfolio_create_form, home, portfolio_manage_form, watchList_manage_form, get_portfolio_list, \
    stock_info, add_stock, update_stock_share, delete_stock, get_stock_data, get_stock_history, get_stock_prediction, \
    get_all_stock_data, create_portfolio, delete_portfolios, get_portfolios_summary, get_latest_stock_news

app_name = 'stocks'

urlpatterns = [
    path('', home, name='home'),
    # django form urls
    path('createPortfolio/', portfolio_create_form, name='createPortfolio'),
    path(r'^(?P<portfolio_pk>[\w_]+)/manageWatchList/$', watchList_manage_form, name='manageWatchList'),
    path(r'^(?P<portfolio_pk>[\w_]+)/managePortfolio/$', portfolio_manage_form, name='managePortfolio'),
    path(r'^(?P<userStock_pk>/stockInfo/$', stock_info, name='stockInfo'),
    # urls for frontend api request
    path('createNewPortfolio/', create_portfolio, name='createNewPortfolio'),
    path('deletePortfolio/', delete_portfolios, name='deletePortfolio'),
    path('getPortfolios/', get_portfolio_list, name='getPortfolios'),
    path('getPortfoliosSummary/', get_portfolios_summary, name='getPortfoliosSummary'),
    re_path(r'^(?P<portfolio_pk>\d+)/addStock/', add_stock, name='addStock'),
    re_path(r'^(?P<portfolio_pk>\d+)/updateStock/', update_stock_share, name='updateStock'),
    re_path(r'^(?P<portfolio_pk>\d+)/deleteStock/', delete_stock, name='deleteStock'),
    path(r'getStock/', get_stock_data, name='getStock'),
    path(r'getStockHistory/', get_stock_history, name='getStockHistory'),
    path(r'getStockPrediction/', get_stock_prediction, name='getStockPrediction'),
    re_path(r'^(?P<portfolio_pk>\d+)/getStocks/', get_all_stock_data, name='getStocks'),
    path(r'getStocksNews/', get_latest_stock_news, name='getStocksNews'),
]
