""" Hotel Amenity association table """

__author__ = "Akele Benjamin(620130803)"
from .. import db

hotel_amenities = db.Table(
    'hotel_amenities',
    db.Column('hotel_id', db.Integer, db.ForeignKey('hotels.id'), primary_key=True),
    db.Column('amenity_id', db.Integer, db.ForeignKey('amenities.id'), primary_key=True)
)