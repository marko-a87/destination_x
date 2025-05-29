""" VisaPolicy model """

__author__ = "Akele Benjamin(620130803)"
__author__ = "Shamar Malcolm"
from .. import db

class VisaPolicy(db.Model):
    __tablename__ = 'visa_policies'
    origin_id      = db.Column(db.Integer, db.ForeignKey('countries.id'), primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('countries.id'), primary_key=True)
    visa_type = db.Column(db.Enum("visa_free", "e_visa", "visa_on_arrival", "visa_required", name="visa_types") ,default="visa_required", nullable="False")
    # visa_free      = db.Column(db.Boolean, default=False, nullable=False)
    # # without_passport= db.Column(db.Boolean, default=False, nullable=False)
    # e_visa         = db.Column(db.Boolean, default=False, nullable=False)
    # visa_on_arrival= db.Column(db.Boolean, default=False, nullable=False)
    # visa_required  = db.Column(db.Boolean, default=False, nullable=False)

    origin_country      = db.relationship(
        'Country', foreign_keys=[origin_id], back_populates='visa_origins'
    )
    destination_country = db.relationship(
        'Country', foreign_keys=[destination_id], back_populates='visa_destinations'
    )

    def __init__(self, origin_id, destination_id, visa_type):
        self.origin_id = origin_id
        self.destination_id = destination_id
        self.visa_type = visa_type
        # self.visa_free = visa_free
        # self.e_visa = e_visa
        # self.visa_on_arrival = visa_on_arrival
        # self.visa_required = visa_required