from django.urls import path
from .views import signup, login

from .views import signup, login, google_login

urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('google/', google_login),
]