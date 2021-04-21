from rest_framework import serializers
from .models import Portfolio, Stock


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'ptype', 'name', 'desc', 'stock_list', 'owner', 'date_created']


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'
