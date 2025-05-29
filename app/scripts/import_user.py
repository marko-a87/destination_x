from app.models.user import User
from app import app,db

def generate_users():
    with app.app_context():
        num  = 0
        for _ in range(5):
            print(f"test{num}@gmail.com")
            user = User(email=f"test{num}@gmail.com", name=f"test{num}", password_hash=f"testpass{num}", date_of_birth="2002-10-5", port_of_origin="Jamaica", country_residence="China")
            db.session.add(user)
            num = num +1

        db.session.commit()
        