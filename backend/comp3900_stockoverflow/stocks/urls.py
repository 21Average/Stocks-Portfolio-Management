from django.urls import path

from .views import portfolio_create_form, home, portfolio_manage_form, watchList_manage_form,stock_info,news_page

app_name= 'stocks'

urlpatterns = [
    path('', home, name='home'),
    path('createPortfolio/', portfolio_create_form, name='createPortfolio'),
    #path('deletestock/<stock_symbol>', delete_stock, name='delete_stock'),
    path(r'^(?P<portfolio_pk>[\w_]+)/manageWatchList/$', watchList_manage_form, name='manageWatchList'),
    path(r'^(?P<portfolio_pk>[\w_]+)/managePortfolio/$', portfolio_manage_form, name='managePortfolio'),
    path(r'^(?P<userStock_pk>/stockInfo/$', stock_info, name='stockInfo'),
    path('new/',news_page, name='newsPage'),
    #path('recommendation/',recommendation, name='recommendation')
]
