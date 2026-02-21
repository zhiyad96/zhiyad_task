from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate

# Create your views here.
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.db.models import Q
from rest_framework.exceptions import PermissionDenied








class RegisterView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)



class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({"message": "Login successful"})

        # 🔐 Access Token Cookie (short-lived)
        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 15,
            path="/"
        )

        # 🔐 Refresh Token Cookie (long-lived)
        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24,
            path="/"   # 🔥 CHANGE THIS
        )

        return response


class UserListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().order_by("-id")
        is_staff = request.query_params.get('is_staff')
        if is_staff is not None:
            if is_staff.lower() == 'true':
                users = users.filter(is_staff=True)
            elif is_staff.lower() == 'false':
                users = users.filter(is_staff=False)

        # Search
        search = request.query_params.get('search')
        if search:
            users = users.filter( Q(username__icontains=search) |
        Q(email__icontains=search))
        ordering = request.query_params.get("ordering")
        if ordering:
            users = users.order_by(ordering)
        else:
            users = users.order_by("-id")  # default sorting



        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "User not found"}, status=404)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({"error": "User not found"}, status=404)

        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # def delete(self, request, pk):
    #     user = get_object_or_404(User, pk=pk)

    #     user.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
    
    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        # 🔒 Prevent self deletion
        if request.user.id == user.id:
            raise PermissionDenied("You cannot delete your own account.")

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response(
            {"message": "Logged out successfully"},
            status=200
        )

        response.delete_cookie("access", path="/")
        response.delete_cookie("refresh", path="/")

        return response

class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token is None:
            return Response({"error": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            response = Response({"message": "Token refreshed"}, status=200)

            response.set_cookie(
                key="access",
                value=new_access,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=60 * 15,
            )

            return response

        except Exception:
            return Response({"error": "Invalid or expired refresh token"}, status=401)