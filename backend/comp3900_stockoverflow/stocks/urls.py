from django.urls import path, re_path

from .views import portfolio_create_form, home, portfolio_manage_form, watchList_manage_form, get_portfolio_list, \
    add_stock, get_stock_data

app_name = 'stocks'

urlpatterns = [
    path('', home, name='home'),
    path('createPortfolio/', portfolio_create_form, name='createPortfolio'),
    path('getPortfolios/', get_portfolio_list, name='getPortfolios'),
    re_path(r'^(?P<portfolio_pk>\d+)/addStock/', add_stock, name='addStock'),
    re_path(r'^(?P<portfolio_pk>\d+)/getStocks/', get_stock_data, name='addStock'),
    # path('deletestock/<stock_symbol>', delete_stock, name='delete_stock'),
    path(r'^(?P<portfolio_pk>[\w_]+)/manageWatchList/$', watchList_manage_form, name='manageWatchList'),
    path(r'^(?P<portfolio_pk>[\w_]+)/managePortfolio/$', portfolio_manage_form, name='managePortfolio'),
]
