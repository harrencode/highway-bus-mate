from app.core.security import get_password_hash
from app.repositories.user_repo import UserRepository


def _make_user(db, repo, username="repouser", email="repo@example.com"):
    return repo.create(
        db,
        {
            "username": username,
            "email": email,
            "hashed_password": get_password_hash("testpass"),
            "is_active": True,
        },
    )


class TestUserRepository:
    def test_create_and_get(self, db):
        repo = UserRepository()
        user = _make_user(db, repo)
        fetched = repo.get(db, user.id)
        assert fetched is not None
        assert fetched.id == user.id
        assert fetched.email == "repo@example.com"

    def test_get_nonexistent_returns_none(self, db):
        repo = UserRepository()
        assert repo.get(db, 99999) is None

    def test_get_by_email(self, db):
        repo = UserRepository()
        user = _make_user(db, repo, username="byemail", email="byemail@example.com")
        found = repo.get_by_email(db, "byemail@example.com")
        assert found is not None
        assert found.id == user.id

    def test_get_by_email_missing_returns_none(self, db):
        repo = UserRepository()
        assert repo.get_by_email(db, "nobody@example.com") is None

    def test_get_by_username(self, db):
        repo = UserRepository()
        user = _make_user(db, repo, username="byusername", email="byusername@example.com")
        found = repo.get_by_username(db, "byusername")
        assert found is not None
        assert found.id == user.id

    def test_authenticate_success(self, db):
        repo = UserRepository()
        _make_user(db, repo, username="authrepo", email="authrepo@example.com")
        user = repo.authenticate(db, "authrepo", "testpass")
        assert user is not None

    def test_authenticate_wrong_password(self, db):
        repo = UserRepository()
        _make_user(db, repo, username="wrongpw", email="wrongpw@example.com")
        user = repo.authenticate(db, "wrongpw", "badpassword")
        assert user is None

    def test_authenticate_unknown_user(self, db):
        repo = UserRepository()
        assert repo.authenticate(db, "ghost", "any") is None

    def test_list_users(self, db):
        repo = UserRepository()
        _make_user(db, repo, username="listuser1", email="list1@example.com")
        _make_user(db, repo, username="listuser2", email="list2@example.com")
        total, users = repo.list_users(db)
        assert total >= 2
        assert len(users) >= 2

    def test_count(self, db):
        repo = UserRepository()
        before = repo.count(db)
        _make_user(db, repo, username="countuser", email="count@example.com")
        assert repo.count(db) == before + 1

    def test_delete(self, db):
        repo = UserRepository()
        user = _make_user(db, repo, username="deluser", email="del@example.com")
        repo.delete(db, user)
        assert repo.get(db, user.id) is None

    def test_search_users_by_username(self, db):
        repo = UserRepository()
        user = _make_user(db, repo, username="searchme", email="searchme@example.com")
        total, users = repo.search_users(db, query="searchme")
        assert total >= 1
        assert any(u.id == user.id for u in users)

    def test_search_users_by_email(self, db):
        repo = UserRepository()
        user = _make_user(db, repo, username="emailsearch", email="emailsearch@example.com")
        total, users = repo.search_users(db, query="emailsearch@")
        assert total >= 1
        assert any(u.id == user.id for u in users)

    def test_search_users_case_insensitive(self, db):
        repo = UserRepository()
        user = _make_user(db, repo, username="CaseUser", email="caseuser@example.com")
        total, users = repo.search_users(db, query="caseuser")
        assert total >= 1
        assert any(u.id == user.id for u in users)

    def test_search_users_no_match_returns_empty(self, db):
        repo = UserRepository()
        total, users = repo.search_users(db, query="zzz_no_match_xyz")
        assert total == 0
        assert users == []

    def test_search_users_pagination(self, db):
        repo = UserRepository()
        _make_user(db, repo, username="page_s1", email="page_s1@example.com")
        _make_user(db, repo, username="page_s2", email="page_s2@example.com")
        _, users = repo.search_users(db, query="page_s", limit=1)
        assert len(users) == 1
