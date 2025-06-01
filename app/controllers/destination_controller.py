from app import app, db,login_manager
from flask import render_template, request, redirect, url_for, flash,jsonify
from flask_bcrypt import Bcrypt
import datetime
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
from flask_login import login_user,logout_user,login_required,current_user
###
# Routing for your application.
###

@app.route('/recommendations', methods=['GET', 'POST'])
def recommendations():
    """Render website's destinations page."""
    if request.method == "POST":
        """Instantiate the recommendation service"""
        recommend_service = RecommendationService()
        
        #1. Get the user preferences.
        user_preferences= UserActivityPreference.query.all()

        countries=  Country.query.all()
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


                                
                        

                    
                        
        #3. Determine the flight cost and hotel cost of the activity
            




           


        # country_objs = recommend_service.get_all_destinations()
        # country_objs_activities = recommend_service.get_destinations(country_objs)
        # for id in country_objs_activities:
        #     hotels = recommend_service.get_local_options(id)
        #     hotels_lst = hotels["hotel"]
        #     iata_code = "YVR"
        #     airport_codes = Airport.query.all()
        #     airport_code = airport_codes[id-1]
        #     for code in airport_codes:
        #         if iata_code != code.iata_code:
        #             flight_price = recommend_service.recommend_flight(iata_code, code.iata_code, datetime.date.today(), "2025-7-12", 1 )
        #             hotel_price = recommend_service.calculate_hotel_price(hotels_lst[id-1])


@login_required
@app.route('/selection', methods=['POST','GET'])
def selection():
    """Render website's preference selection page."""
    if request.method == 'POST':
        """Getting the priority assigned to each category"""
        
        
        categories = db.session.query(Category.name).all()
        category_lst = [category[0].replace(',', '') for category in categories]
        category_activities = {}
        for cat in category_lst:
            # activities_for_cat = db.session.query(Activity.name).filter_by(category= cat).all()
            # activites_lst = [activity[0].replace(',', '') for activity in activities_for_cat] 
            # category_activities[cat] = activites_lst
            #allows me to get the form data for each category
            # category_activities[cat] = request.form.get(cat_slider)
            pass

        
        budget_val = request.form.get('budget_slider')
        beach_water_sports = request.form.get("beach_water_sports")
        educational_workshops = request.form.get("educational_workshops")

        climate_weight = request.form.get('climate_slider')
        landmark_weight = request.form.get('landmark_slider')
        outdoor_exp_weight = request.form.get('outdoor_slider')
        culinary_weight = request.form.get('food_slider')
        entertainment_weight = request.form.get('entertainment_slider')
        relaxation_weight = request.form.get('relaxation_slider')

        user_id = current_user.id

        #Instiance a instance of the user's preferences
        user_preference = UserPreference(user_id, budget_val, climate_weight, 
                                        landmark_weight, outdoor_exp_weight, 
                                        culinary_weight, entertainment_weight,relaxation_weight)
        
        db.session.add(user_preference)
        db.session.commit()

        print("Budget value is: ", budget_val)
        print("Climate weight is:", climate_weight)
        print("Landmark weight is:", landmark_weight)
        print("Outdoor experiences weight is: ", outdoor_exp_weight)
        print("Food and culinary experiences weight is: ", culinary_weight)
        print("Entertainment weight is: ", entertainment_weight)

        
        return redirect(url_for('recommendations'))
    return render_template('selection_pg/selection_base.html')

@app.route('/details-page')
def destination_details():
    """Render website's signup quiz page."""
    return render_template('destinations_pg/destination_details.html')