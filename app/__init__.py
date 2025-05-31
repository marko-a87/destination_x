"""Init file to create the app instance
This file contains the create_app function which creates the app instance.
"""

__author__ = "Akele Benjamin(620130803)"
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
import os
from flask_login import LoginManager
import sys

# import flask migrate here
from flask_migrate import Migrate
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    

    db.init_app(app)
    migrate.init_app(app, db)

   
    
    # Make sure all models are loaded:
    from app.models import Activity,City,Country,User, VisaPolicy,Airport,Destination,Category,FlightPrice,Hotel,\
        Recommendation, hotel_amenities,UserActivityPreference,\
        UserAmenityPreference,UserPreference
    


    #initialize login manager
    login_manager.init_app(app)
    login_manager.login_view = "login"
    return app


app = create_app()
from app.controllers import auth_controller, home_controller, destination_controller
from app.tests import test_templates

