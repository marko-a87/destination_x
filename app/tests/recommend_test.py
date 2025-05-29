import os
import sys

print(sys.path)

from flask import render_template, request, redirect, url_for, flash,jsonify
from flask_bcrypt import Bcrypt
import datetime
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from app import create_app

from app.models.user import User
from app.services.reccommendation_service import RecommendationService

from app.models.user_activity_preferences import UserActivityPreference
from app.models.categories import Category
from app.models.airport import Airport
from app.models.country import Country
from app.models.city import City
from app.models.hotel import Hotel
from app.models.activity import Activity
import random


def recommend_test():

    app = create_app()

    with app.app_context():

        recommend_service = RecommendationService()
        
        #1. Get the user preferences.
        user_preferences= UserActivityPreference.query.all()
        countries=  Country.query.all()

        budget = 10000
        
        for country in countries:
            if not country:
                continue
            else:
                cid = country.id
                city_objs = City.query.filter_by(country_id=cid).all()
                city_list = []
                for city in city_objs:
                    activities = Activity.query.filter_by(city_id=city.id).all()
                    hotels =  Hotel.query.filter_by(city_id = city.id).all()
                    airports = Airport.query.filter_by(city_id = city.id).all()
                    city_list.append({'city': city.name, 'activities': activities, "hotels":hotels, "airports":airports })
        
        #2. Get the activity name and the weight assigned
        for preference in user_preferences:
            weight = preference.priority
            category_obj =  Category.query.filter_by(id=preference.category_id).first()
            activity_name = category_obj.name
            user_airport_code = "YVR"
            user_hotel = "Grand Gardens"           
            for city in city_list:
                flight_price = 0
                hotel_price = 0
                activity_price = 0
                activity_lst = [activity.name for activity in city["activities"]]
                hotel_lst = [hotel.name for hotel in city_list["hotels"]]
                if activity_name in activity_lst:
                    activity_obj = Activity.query.filter_by(name= activity_name).first()
                    activity_price=  activity_obj.price
                    if user_hotel in city_list["hotel_lst"]:
                            hotel = Hotel.query.filter_by(name = user_hotel).first()
                            hotel_price = recommend_service.calculate_hotel_price(hotel.id, 5, datetime.date.today(), "2025-7-11")
                            iata_code_lst = [airport.iata_code for airport in city_list["airports"]]
                            for iata_code in iata_code_lst:
                                if user_airport_code != iata_code:
                                    flight_price = recommend_service.recommend_flight(user_airport_code, iata_code,  datetime.date.today(), "2025-7-12", 1)
                                total_price = flight_price + activity_price + hotel_price

                                budget_ratio = budget/ total_price
                                if budget_ratio > 1:
                                    budget_ratio = 1

    pass





recommend_test()