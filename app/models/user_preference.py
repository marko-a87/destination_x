""" User Preference Model """

__author__ = "Akele Benjamin(620130803)"
from .. import db
class UserPreference(db.Model):
    __tablename__ = 'user_preferences'
    user_id            = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    budget             = db.Column(db.Numeric)
    # climate_pref       = db.Column(db.String(50))
    # check_in_date      = db.Column(db.Date)
    # check_out_date     = db.Column(db.Date)
    # number_of_travelers= db.Column(db.Integer)
    # currency_code      = db.Column(db.String(3))
    # visa_required_filter = db.Boolean
    weight_climate = db.Column(db.Numeric)
    weight_landmarks      = db.Column(db.Numeric)
    weight_outdoor_exp = db.Column(db.Numeric)
    weight_food_culinary = db.Column(db.Numeric)
    weight_entertainment = db.Column(db.Numeric)
    weight_relaxation = db.Column(db.Numeric)
    # weight_winter_sports = db.Column(db.Numeric)
    # weight_advennture       = db.Column(db.Numeric)
    # weight_outdoor     = db.Column(db.Numeric)
    # weight_shopping   = db.Column(db.Numeric)
    # weight_arts     = db.Column(db.Numeric)
    # weight_road       = db.Column(db.Numeric)
    # weight_wildlife   = db.Column(db.Numeric)
    # weight_historical    = db.Column(db.Numeric)
    # weight_beach    = db.Column(db.Numeric)
    # weight_food      = db.Column(db.Numeric)
    # weight_wine     = db.Column(db.Numeric)
    # weight_education      = db.Column(db.Numeric)
    # weight_culture      = db.Column(db.Numeric)
    # weight_wellness   = db.Column(db.Numeric)
    # weight_family = db.Column(db.Numeric)
    # weight_music = db.Column(db.Numeric)
    # weight_festival = db.Column(db.Numeric)
    # weight_landmarks      = db.Column(db.Numeric)

    user = db.relationship('User', back_populates='preferences')

    def __init__(self, user_id, budget, weight_climate, weight_landmarks, weight_outdoor_exp, weight_food_culinary, weight_entertainment, weight_relaxation):
        self.user_id = user_id
        self.budget = budget
        self.weight_climate = weight_climate
        self.weight_landmarks = weight_landmarks
        self.weight_outdoor_exp = weight_outdoor_exp
        self.weight_food_culinary = weight_food_culinary
        self.weight_entertainment = weight_entertainment
        self.weight_relaxation = weight_relaxation
        