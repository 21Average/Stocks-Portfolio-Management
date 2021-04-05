from django import forms
from .models import Stock, Portfolio

class PortfolioCreateForm(forms.ModelForm):
    PTYPE_CHOICES =(
            (None, 'Choose your type'),
            ('Portfolio', 'Portfolio'),
            ('WatchList', 'Watch List'),
    )
    ptype = forms.ChoiceField(choices = PTYPE_CHOICES, widget= forms.Select())
    class Meta:
        model = Portfolio
        fields = ['ptype','name','desc']


class WatchListManageForm(forms.ModelForm):
    class Meta:
        model = Stock
        fields = ['ticker']

class PortfolioManageForm(forms.ModelForm):
    class Meta:
        model = Stock
        fields = ['ticker','quality','buying_price']