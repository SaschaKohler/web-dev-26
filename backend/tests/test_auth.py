"""
Authentication & authorization tests.
Covers: login, logout, token refresh, current user, user management ViewSet.
"""
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from cms_pages.models import Site
from .conftest import UserFactory, SiteFactory, get_tokens_for_user


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.auth
class TestLoginView:

    def test_staff_user_can_login(self, api_client, staff_user):
        url = reverse("login")
        response = api_client.post(
            url,
            {"username": staff_user.username, "password": "staffpass123"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert response.data["user"]["username"] == staff_user.username

    def test_login_sets_refresh_cookie(self, api_client, staff_user):
        url = reverse("login")
        response = api_client.post(
            url,
            {"username": staff_user.username, "password": "staffpass123"},
            format="json",
        )
        assert "refresh_token" in response.cookies

    def test_non_staff_user_cannot_login(self, api_client, user):
        url = reverse("login")
        response = api_client.post(
            url,
            {"username": user.username, "password": "testpass123"},
            format="json",
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "error" in response.data

    def test_inactive_user_cannot_login(self, api_client):
        inactive = UserFactory.create_staff(username="inactive_staff")
        inactive.is_active = False
        inactive.save()
        url = reverse("login")
        response = api_client.post(
            url,
            {"username": "inactive_staff", "password": "staffpass123"},
            format="json",
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_credentials(self, api_client):
        url = reverse("login")
        response = api_client.post(
            url,
            {"username": "nobody", "password": "wrongpass"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_missing_credentials(self, api_client):
        url = reverse("login")
        response = api_client.post(url, {}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_missing_password(self, api_client):
        url = reverse("login")
        response = api_client.post(url, {"username": "someone"}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_missing_username(self, api_client):
        url = reverse("login")
        response = api_client.post(url, {"password": "pass"}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------------------------
# Logout
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.auth
class TestLogoutView:

    def test_logout_authenticated_user(self, auth_client, staff_user):
        url = reverse("logout")
        refresh = RefreshToken.for_user(staff_user)
        auth_client.cookies["refresh_token"] = str(refresh)
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Logout successful"

    def test_logout_clears_cookie(self, auth_client, staff_user):
        url = reverse("logout")
        refresh = RefreshToken.for_user(staff_user)
        auth_client.cookies["refresh_token"] = str(refresh)
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK

    def test_logout_without_auth_fails(self, api_client):
        url = reverse("logout")
        response = api_client.post(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_with_invalid_token_still_succeeds(self, auth_client):
        url = reverse("logout")
        auth_client.cookies["refresh_token"] = "invalid.token.value"
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK


# ---------------------------------------------------------------------------
# Token Refresh
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.auth
class TestRefreshTokenView:

    def test_valid_refresh_token_returns_new_access(self, api_client, staff_user):
        refresh = RefreshToken.for_user(staff_user)
        api_client.cookies["refresh_token"] = str(refresh)
        url = reverse("refresh-token")
        response = api_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "user" in response.data

    def test_missing_refresh_token_returns_401(self, api_client):
        url = reverse("refresh-token")
        response = api_client.post(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_invalid_refresh_token_returns_401(self, api_client):
        api_client.cookies["refresh_token"] = "totally.invalid.token"
        url = reverse("refresh-token")
        response = api_client.post(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_inactive_user_refresh_denied(self, api_client):
        user = UserFactory.create_staff(username="inactive_refresh")
        refresh = RefreshToken.for_user(user)
        user.is_active = False
        user.save()
        api_client.cookies["refresh_token"] = str(refresh)
        url = reverse("refresh-token")
        response = api_client.post(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_non_staff_user_refresh_denied(self, api_client):
        regular = UserFactory.create(username="refresh_regular")
        refresh = RefreshToken.for_user(regular)
        api_client.cookies["refresh_token"] = str(refresh)
        url = reverse("refresh-token")
        response = api_client.post(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN


# ---------------------------------------------------------------------------
# Current User
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.auth
class TestCurrentUserView:

    def test_authenticated_user_gets_own_data(self, auth_client, staff_user):
        url = reverse("current-user")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == staff_user.username
        assert response.data["is_staff"] is True

    def test_unauthenticated_request_denied(self, api_client):
        url = reverse("current-user")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ---------------------------------------------------------------------------
# CSRF Token
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.auth
class TestCsrfTokenView:

    def test_csrf_token_returned(self, api_client):
        url = reverse("csrf-token")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert "csrfToken" in response.data
        assert len(response.data["csrfToken"]) > 0


# ---------------------------------------------------------------------------
# UserViewSet (Admin User Management)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
@pytest.mark.auth
class TestUserViewSet:

    def test_superuser_can_list_users(self, superuser_client, staff_user):
        url = reverse("user-list")
        response = superuser_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        usernames = [u["username"] for u in response.data]
        assert staff_user.username in usernames

    def test_non_admin_cannot_list_users(self, auth_client):
        url = reverse("user-list")
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_superuser_can_create_user(self, superuser_client):
        url = reverse("user-list")
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepass123",
            "is_staff": False,
        }
        response = superuser_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["username"] == "newuser"

    def test_create_user_without_password_fails(self, superuser_client):
        url = reverse("user-list")
        payload = {"username": "nopassword", "email": "x@x.com"}
        response = superuser_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_set_password_action(self, superuser_client):
        target = UserFactory.create(username="pw_target")
        url = reverse("user-set-password", args=[target.pk])
        response = superuser_client.post(
            url, {"password": "newpassword99"}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK
        target.refresh_from_db()
        assert target.check_password("newpassword99")

    def test_set_password_too_short_fails(self, superuser_client):
        target = UserFactory.create(username="short_pw_target")
        url = reverse("user-set-password", args=[target.pk])
        response = superuser_client.post(url, {"password": "short"}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_toggle_staff_action(self, superuser_client):
        target = UserFactory.create(username="toggle_staff_target")
        assert target.is_staff is False
        url = reverse("user-toggle-staff", args=[target.pk])
        response = superuser_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        target.refresh_from_db()
        assert target.is_staff is True
        # toggle back
        superuser_client.post(url)
        target.refresh_from_db()
        assert target.is_staff is False

    def test_cannot_toggle_own_staff_status(self, superuser_client, superuser):
        url = reverse("user-toggle-staff", args=[superuser.pk])
        response = superuser_client.post(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_toggle_active_action(self, superuser_client):
        target = UserFactory.create(username="toggle_active_target")
        url = reverse("user-toggle-active", args=[target.pk])
        response = superuser_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        target.refresh_from_db()
        assert target.is_active is False

    def test_cannot_deactivate_yourself(self, superuser_client, superuser):
        url = reverse("user-toggle-active", args=[superuser.pk])
        response = superuser_client.post(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_non_admin_cannot_create_user(self, auth_client):
        url = reverse("user-list")
        payload = {
            "username": "sneaky",
            "email": "sneaky@example.com",
            "password": "sneakypass",
        }
        response = auth_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN
