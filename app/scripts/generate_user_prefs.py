from app.models.user_activity_preferences  import UserActivityPreference
from app.models.activity import Activity
from app.models.categories import Category
from app import db, app
import random

def generate_user_preferences():
    with app.app_context():
        activities = Activity.query.all()
        user_id= 1
        category_lst = [pref.category for pref in activities]
        category_objs = [Category.query.filter_by(name=category_name).first() for category_name in category_lst]
        for category in category_objs:
            activity_weight = random.randint(1,10)
            category_id = category.id
            user_preference= UserActivityPreference(user_id=user_id, category_id=category_id, priority=activity_weight)
            db.session.add(user_preference)
        print("Successfully added  user_preferences to database")
        db.session.commit()