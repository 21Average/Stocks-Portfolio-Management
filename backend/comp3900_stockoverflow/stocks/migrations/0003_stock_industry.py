# Generated by Django 3.1.7 on 2021-04-20 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0002_auto_20210420_2021'),
    ]

    operations = [
        migrations.AddField(
            model_name='stock',
            name='industry',
            field=models.CharField(default='', max_length=50, verbose_name='Industry'),
        ),
    ]
