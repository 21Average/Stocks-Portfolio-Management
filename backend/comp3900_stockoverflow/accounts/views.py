from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User,auth
# Create your views here.


def register(request):

    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        print(name)
        print(email)
        user = Users.objects.create_user(username=name, password = password1,email = email)
        user.save();
        print('user created')
        pass
    else:
        return render(request, 'register.html');
    return render(request, 'register.html');
def add(request):
    #val1 = request.GET['num1']
    #val2 = request.GET['num2']
    #res = int(val1) + int(val2)
    return render(request,'home.html',{'result': 3})