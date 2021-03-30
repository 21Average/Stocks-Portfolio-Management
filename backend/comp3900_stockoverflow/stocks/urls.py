from django.urls import path

from .views import portfolio_create_form, home, portfolio_manage_form, watchList_manage_form

app_name= 'stocks'

urlpatterns = [
    path('', home, name='home'),
    path('createPortfolio/', portfolio_create_form, name='createPortfolio'),
    path('managePortfolio/', portfolio_manage_form, name='managePortfolio'),
    #path('manageWatchList/<portfolio_pk>', watchList_manage_form, name='manageWatchList'),
    #path('deletestock/<stock_symbol>', delete_stock, name='delete_stock'),
    path(r'^(?P<portfolio_pk>[\w_]+)/$', watchList_manage_form, name='manageWatchList'),
]
