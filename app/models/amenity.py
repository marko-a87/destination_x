""" Amenity model """

__author__ = "Akele Benjamin(620130803)"
from .. import db
class Amenity(db.Model):
    __tablename__ = 'amenities'
    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)

    hotels = db.relationship(
        'Hotel', secondary='hotel_amenities', back_populates='amenities'
    )
    user_preferences = db.relationship(
        'UserAmenityPreference', back_populates='amenity', overlaps='users,amenities'
    )
    users = db.relationship(
        'User', secondary='user_amenity_preferences', back_populates='amenities', overlaps='amenity_preferences,user_preferences'
    )

    def __init__(self, name):
        self.name = name    