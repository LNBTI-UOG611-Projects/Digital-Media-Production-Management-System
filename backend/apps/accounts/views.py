from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, MeUpdateSerializer, RegisterSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    """POST /api/auth/token/  {username, password}  ->  {access, refresh, user}"""
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]


class MeView(RetrieveUpdateAPIView):
    """GET /api/auth/me/ shows the signed-in user. PATCH changes name and phone."""
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        return MeUpdateSerializer if self.request.method == "PATCH" else UserSerializer

    def patch(self, request, *args, **kwargs):
        serializer = MeUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class RegisterView(CreateAPIView):
    """POST /api/auth/register/  creates a client account.  201 on success, 400 with {field: [messages]}."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"id": user.id, "username": user.username, "role": user.role}, status=status.HTTP_201_CREATED)
