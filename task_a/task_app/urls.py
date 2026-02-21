from django.urls import path
from .views import UserListCreate,UserDetail,RegisterView,Login,Logout,CookieTokenRefreshView,MeView

urlpatterns = [
    path("token/refresh/", CookieTokenRefreshView.as_view()),
    path("users/", UserListCreate.as_view()),
    path("me/", MeView.as_view()),
    path("users/<int:pk>/", UserDetail.as_view()),
    path("register/", RegisterView.as_view()),
    path("login/", Login.as_view()),
    path("logout/", Logout.as_view()),
]
