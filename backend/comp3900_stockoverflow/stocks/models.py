from django.db import models
from accounts.models import CustomUser, CustomUserManager
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class Stock(models.Model):
    #sid = models.IntegerField(verbose_name ='Stock ID', primary_key=True)
    ticker = models.CharField(verbose_name ='Ticker', max_length=10)
    quality = models.IntegerField(verbose_name = 'Quality',default=0)
    #name = models.CharField(verbose_name ='Stock Name', max_length=10)
    profit = models.DecimalField(max_digits=10,verbose_name ='Profit', decimal_places=2, default=0.00)
    #change = models.DecimalField(max_digits=10,verbose_name ='Change',decimal_places=2)
    #stocks_owned = models.ForeignKey('User', verbose_name='Stock Owned', on_delete=models.CASCADE)
    buying_price = models.DecimalField(max_digits=10,verbose_name ='Buying Price',decimal_places=2,default=0)
    #balance = models.DecimalField(decimal_places=2)
    portfoilo = models.ForeignKey("Portfolio", verbose_name= 'Portfolio' ,on_delete=models.CASCADE)
    company = models.CharField(verbose_name ='Company Name', max_length=50,default='')
    industry = models.CharField(verbose_name ='Industry', max_length=50,default='')

    def save(self, *args, **kwargs):
        self.ticker = self.ticker.upper()
        return super(Stock, self).save(*args, **kwargs)

    def __str__(self):
        return self.ticker

class Portfolio(models.Model):
    
    '''
    TYPES =(
        ('Portfolio', 'Portfolio'),
        ('WatchList', 'Watch List'),
    )
    ptype = models.CharField(max_length=30, choices=TYPES, default='', verbose_name = 'Portfolio Type')
    '''
    ptype = models.CharField(max_length=30,default='', verbose_name = 'Portfolio Type')
    #pid = models.IntegerField(verbose_name ='Portfoilo ID', primary_key=True)
    #owner = models.ForeignKey("accounts.CustomUser", verbose_name='Owner', on_delete=models.CASCADE)
    name = models.CharField(verbose_name ='Portfoilo Name', max_length=10)
    desc = models.CharField(verbose_name ='Description', max_length=200)
    stock_list = ArrayField(models.CharField(max_length=200), default = list)
            
    def __str__(self):
         return "{}:{}".format(self.belong_user.email,self.name)

class Industry(models.Model):
    industry_name = models.CharField(verbose_name ='Industry', max_length=50)

