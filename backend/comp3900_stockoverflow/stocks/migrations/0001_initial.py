# Generated by Django 3.1.7 on 2021-03-30 13:00

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ptype', models.CharField(default='', max_length=30, verbose_name='Portfolio Type')),
                ('name', models.CharField(max_length=10, verbose_name='Portfoilo Name')),
                ('desc', models.CharField(max_length=200, verbose_name='Description')),
                ('stock_list', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, null=True, size=None)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticker', models.CharField(max_length=10, verbose_name='Ticker')),
                ('portfoilo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.portfolio', verbose_name='Portfolio')),
            ],
        ),
    ]