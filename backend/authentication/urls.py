from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import include, path
from . import views

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name="register"),
    path('token/', views.Login.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.RefreshToken.as_view(), name='token_refresh'),
    path('approve/<int:varification_code>/', views.VerificationAwaitView.as_view(), name="account verification"),
    path('password/request_change/', views.PasswordChangeRequestView.as_view(), name="request password change"),
    path('password/change/', views.PasswordChangeValidatorView.as_view(), name='change password'),
    path('logout/', views.Logout.as_view(), name='logout'),
]