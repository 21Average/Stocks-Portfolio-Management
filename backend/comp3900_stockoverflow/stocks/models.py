from django.db import models
from accounts.models import CustomUser
from django.contrib.postgres.fields import ArrayField


class Portfolio(models.Model):
    '''
    TYPES =(
        ('Portfolio', 'Portfolio'),
        ('WatchList', 'Watch List'),
    )
    ptype = models.CharField(max_length=30, choices=TYPES, default='', verbose_name = 'Portfolio Type')
    '''
    ptype = models.CharField(max_length=30, default='', verbose_name='Portfolio Type')
    owner = models.ForeignKey(CustomUser, verbose_name='Owner', blank=True, null=True, on_delete=models.CASCADE)
    name = models.CharField(verbose_name='Portfoilo Name', max_length=10)
    desc = models.CharField(verbose_name='Description', max_length=200)
    stock_list = ArrayField(models.CharField(max_length=200), default=list)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
         return "{}:{}".format(self.owner,self.name)


class Stock(models.Model):
    ticker = models.CharField(verbose_name='Ticker', max_length=10)
    quality = models.IntegerField(verbose_name='Quality', default=0)
    profit = models.DecimalField(max_digits=10,verbose_name ='Profit', decimal_places=2, default=0.00)
    buying_price = models.DecimalField(max_digits=10, verbose_name='Buying Price', decimal_places=2, default=0)
    portfolio = models.ForeignKey(Portfolio, verbose_name='Portfolio', blank=True, null=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.ticker = self.ticker.upper()
        return super(Stock, self).save(*args, **kwargs)
    # @staticmethod
    # def profit(buy_price, current_price, quality):
    #     diff = buy_price - current_price
    #     profit = diff * quality

    #     return profit

    def __str__(self):
        return self.ticker
