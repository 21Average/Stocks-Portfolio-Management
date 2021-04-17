from django.urls import path, re_path
from .views import portfolio_create_form, home, portfolio_manage_form, watchList_manage_form, get_portfolio_list, \
    stock_info, add_stock, get_stock_data, get_stock_history, get_all_stock_data, create_portfolio, delete_portfolios, \
    delete_stock

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
    re_path(r'^(?P<portfolio_pk>\d+)/addStock/', add_stock, name='addStock'),
    re_path(r'^(?P<portfolio_pk>\d+)/deleteStock/', delete_stock, name='deleteStock'),
    re_path(r'^(?P<portfolio_pk>\d+)/getStock/', get_stock_data, name='getStock'),
    path(r'getStockHistory/', get_stock_history, name='getStockHistory'),
    re_path(r'^(?P<portfolio_pk>\d+)/getStocks/', get_all_stock_data, name='getStocks'),
]
