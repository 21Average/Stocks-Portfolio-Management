from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, UserPasswordSerializer


class Register(CreateAPIView):
    model = CustomUser
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserDetail(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        if 'password' in request.data:
            # update password
            serialized = UserPasswordSerializer(data=request.data)
            if serialized.is_valid():
                user = self.get_object()
                user.set_password(serialized.data['password'])
                user.save()
            else:
                return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
        # update everything else
        return self.partial_update(request, *args, **kwargs)


def add(request):
    # val1 = request.GET['num1']
    # val2 = request.GET['num2']
    # res = int(val1) + int(val2)
    return render(request, 'home.html', {'result': 3})
