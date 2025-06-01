from app.models.user import User
from app import app,db
from flask_bcrypt import Bcrypt

def generate_users():
    with app.app_context():
        num  = 0
        bcrypt = Bcrypt(app)
        for _ in range(5):
            user = User(email=f"test{num}@gmail.com", name=f"test{num}", password_hash=bcrypt.generate_password_hash(f"testpass{num}").decode("utf-8"), date_of_birth="2002-10-5", port_of_origin="Jamaica", country_residence="China")
            print(f"User account created")
            db.session.add(user)
            num = num +1
        print(f"Saved users to the database")
        db.session.commit()
        