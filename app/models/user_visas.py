""" User PassPort System"""
__author__ = "Shamar Malcolm"
from .. import db
class UserVisa(db.Model):
    __tablename__ = 'user_visa'
    id = db.Column(db.Integer, primary_key=True)
    user_id            = db.Column(db.Integer, db.ForeignKey('users.id'))
    visa_country   = db.Column(db.String(128))
   

    def __init__(self, user_id, visa_country):
        self.user_id = user_id
        self.visa_country = visa_country
        