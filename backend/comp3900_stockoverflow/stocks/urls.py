from django.urls import path

from .views import home, portfolio, delete_stock

urlpatterns = [
    path('', home, name='home'),
    path('portfolio/', portfolio, name='portfolio'),
    path('deletestock/<stock_symbol>', delete_stock, name='delete_stock'),
]
