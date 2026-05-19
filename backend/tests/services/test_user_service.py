import pytest

from app.core.exceptions import ConflictException, NotFoundException
from app.models.enums import UserRole
from app.schemas.user import UserCreate, UserRegister, UserUpdate
from app.services.user_service import UserService


@pytest.fixture()
def service() -> UserService:
    return UserService()


@pytest.fixture()
def existing_user(db, service):
    return service.register(
        db,
        UserRegister(username="testuser", email="test@example.com", password="Password123"),
    )


class TestRegister:
    def test_register_success(self, db, service):
        user = service.register(
            db,
            UserRegister(username="newuser", email="new@example.com", password="Pass1234"),
        )
        assert user.id is not None
        assert user.username == "newuser"
        assert user.email == "new@example.com"
        assert user.hashed_password != "Pass1234"
        assert user.is_active is True
        assert user.role == UserRole.USER

    def test_register_duplicate_email_raises(self, db, service, existing_user):
        with pytest.raises(ConflictException, match="already registered"):
            service.register(
                db,
                UserRegister(username="other", email=existing_user.email, password="Pass1234"),
            )

    def test_register_duplicate_username_raises(self, db, service, existing_user):
        with pytest.raises(ConflictException, match="already taken"):
            service.register(
                db,
                UserRegister(
                    username=existing_user.username,
                    email="other@example.com",
                    password="Pass1234",
                ),
            )


class TestCreate:
    def test_create_with_explicit_role(self, db, service):
        user = service.create(
            db,
            UserCreate(
                username="adminuser",
                email="admin@example.com",
                password="Pass1234",
                role=UserRole.ADMIN,
            ),
        )
        assert user.role == UserRole.ADMIN

    def test_create_duplicate_email_raises(self, db, service, existing_user):
        with pytest.raises(ConflictException):
            service.create(
                db,
                UserCreate(username="other2", email=existing_user.email, password="Pass1234"),
            )

    def test_create_duplicate_username_raises(self, db, service, existing_user):
        with pytest.raises(ConflictException):
            service.create(
                db,
                UserCreate(
                    username=existing_user.username,
                    email="unique@example.com",
                    password="Pass1234",
                ),
            )


class TestGet:
    def test_get_existing_user(self, db, service, existing_user):
        user = service.get(db, existing_user.id)
        assert user.id == existing_user.id

    def test_get_nonexistent_raises(self, db, service):
        with pytest.raises(NotFoundException):
            service.get(db, 99999)


class TestList:
    def test_list_returns_users(self, db, service, existing_user):
        total, users = service.list_users(db)
        assert total >= 1
        assert any(u.id == existing_user.id for u in users)

    def test_list_pagination(self, db, service, existing_user):
        _, users = service.list_users(db, skip=0, limit=1)
        assert len(users) <= 1


class TestUpdate:
    def test_update_username(self, db, service, existing_user):
        updated = service.update(db, existing_user.id, UserUpdate(username="updated_name"))
        assert updated.username == "updated_name"

    def test_update_password_hashes(self, db, service, existing_user):
        updated = service.update(db, existing_user.id, UserUpdate(password="newPass999"))
        assert updated.hashed_password != "newPass999"

    def test_update_nonexistent_raises(self, db, service):
        with pytest.raises(NotFoundException):
            service.update(db, 99999, UserUpdate(username="ghost"))


class TestDelete:
    def test_delete_user(self, db, service, existing_user):
        service.delete(db, existing_user.id)
        with pytest.raises(NotFoundException):
            service.get(db, existing_user.id)

    def test_delete_nonexistent_raises(self, db, service):
        with pytest.raises(NotFoundException):
            service.delete(db, 99999)


class TestSearch:
    def test_search_by_username_match(self, db, service, existing_user):
        total, users = service.search(db, query="testuser")
        assert total >= 1
        assert any(u.id == existing_user.id for u in users)

    def test_search_by_email_match(self, db, service, existing_user):
        total, users = service.search(db, query="test@example")
        assert total >= 1
        assert any(u.id == existing_user.id for u in users)

    def test_search_partial_match(self, db, service, existing_user):
        total, users = service.search(db, query="testus")
        assert total >= 1

    def test_search_no_match_returns_empty(self, db, service, existing_user):
        total, users = service.search(db, query="zzz_no_match_xyz")
        assert total == 0
        assert users == []

    def test_search_pagination_limit(self, db, service):
        from app.schemas.user import UserRegister

        service.register(
            db, UserRegister(username="srch1", email="srch1@example.com", password="Pass1234")
        )
        service.register(
            db, UserRegister(username="srch2", email="srch2@example.com", password="Pass1234")
        )
        _, users = service.search(db, query="srch", limit=1)
        assert len(users) == 1
