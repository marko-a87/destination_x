""" User Activity Preference Model """

__author__ = "Akele Benjamin(620130803)"
from .. import db
class UserActivityPreference(db.Model):
    __tablename__ = 'user_activity_preferences'
    id =  db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'),nullable=False)
    priority    = db.Column(db.Integer, default=1)

    user     = db.relationship('User',     back_populates='activity_preferences')

    def __init__(self, user_id, category_id, priority):
        self.user_id = user_id
        self.category_id = category_id
        self.priority = priority
        