from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .serializers import UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Secure JWT-based login with HttpOnly cookies
    - Validates credentials
    - Checks staff status
    - Returns access token in response body
    - Sets refresh token in HttpOnly cookie
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        if not user.is_staff:
            return Response(
                {'error': 'You do not have permission to access the admin area'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not user.is_active:
            return Response(
                {'error': 'This account has been deactivated'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        refresh = RefreshToken.for_user(user)
        
        response = Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'message': 'Login successful'
        })
        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60,
            path='/'
        )
        
        return response
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Secure logout - blacklists refresh token
    """
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        response = Response({'message': 'Logout successful'})
        response.delete_cookie('refresh_token', path='/')
        return response
    except (TokenError, InvalidToken):
        response = Response({'message': 'Logout successful'})
        response.delete_cookie('refresh_token', path='/')
        return response


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Refresh access token using HttpOnly cookie
    - Reads refresh token from HttpOnly cookie
    - Returns new access token
    - Rotates refresh token (sets new one in cookie)
    """
    refresh_token = request.COOKIES.get('refresh_token')
    
    if not refresh_token:
        return Response(
            {'error': 'Refresh token not found'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        refresh = RefreshToken(refresh_token)
        
        user_id = refresh.payload.get('user_id')
        user = User.objects.get(id=user_id)
        
        if not user.is_staff or not user.is_active:
            return Response(
                {'error': 'User is not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_refresh = refresh
        new_refresh.set_jti()
        new_refresh.set_exp()
        new_refresh.set_iat()
        
        response = Response({
            'access': str(new_refresh.access_token),
            'user': UserSerializer(user).data
        })
        
        response.set_cookie(
            key='refresh_token',
            value=str(new_refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60,
            path='/'
        )
        
        return response
        
    except (TokenError, InvalidToken) as e:
        return Response(
            {'error': 'Invalid or expired refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get current authenticated user
    """
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token_view(request):
    """
    Get CSRF token for forms
    """
    return Response({'csrfToken': get_token(request)})


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user management
    Requires admin/staff permissions
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')
    
    def create(self, request, *args, **kwargs):
        """
        Create new user with password hashing
        """
        password = request.data.get('password')
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data.get('email', ''),
            password=password,
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            is_staff=serializer.validated_data.get('is_staff', False),
            is_active=serializer.validated_data.get('is_active', True),
        )
        
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        """
        Change user password
        """
        user = self.get_object()
        password = request.data.get('password')
        
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters long'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(password)
        user.save()
        
        return Response({'message': 'Password updated successfully'})
    
    @action(detail=True, methods=['post'])
    def toggle_staff(self, request, pk=None):
        """
        Toggle staff status
        """
        user = self.get_object()
        
        if user == request.user:
            return Response(
                {'error': 'You cannot modify your own staff status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_staff = not user.is_staff
        user.save()
        
        return Response(UserSerializer(user).data)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """
        Toggle active status
        """
        user = self.get_object()
        
        if user == request.user:
            return Response(
                {'error': 'You cannot deactivate yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_active = not user.is_active
        user.save()
        
        return Response(UserSerializer(user).data)
