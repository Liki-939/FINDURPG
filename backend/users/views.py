from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import SignupSerializer
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens(user)
        return Response({
            'message': 'User created',
            'tokens': tokens
        })
    return Response({
        "errors": serializer.errors
    }, status=400)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        tokens = get_tokens(user)
        return Response({
            'message': 'Login successful',
            'tokens': tokens,
            'role': user.role
        })
    return Response({'error': 'Invalid credentials'}, status=401)
@api_view(['POST'])
def google_login(request):
    # frontend sends google token
    # verify token later
    return Response({"message": "Google login coming soon"})