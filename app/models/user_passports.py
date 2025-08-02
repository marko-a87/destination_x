""" User PassPort System"""
__author__ = "Shamar Malcolm"
from .. import db
class UserPassPort(db.Model):
    __tablename__ = 'user_passports'
    id = db.Column(db.Integer, primary_key=True)
    user_id            = db.Column(db.Integer, db.ForeignKey('users.id'))
    passport_country   = db.Column(db.String(128))
   

    def __init__(self, user_id, passport_country):
        self.user_id = user_id
        self.passport_country= passport_country
        