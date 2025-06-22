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

from app.utils.helpers import object_as_dict

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
    
    
    
    """Render website's preference selection page."""
    return render_template('recommendations/recommendation_base.html')


#@login_required
@app.route('/selection', methods=['POST','GET'])
def selection():
    """Render website's preference selection page."""  
    # Handle GET request to load the selection page
    if request.method == 'GET':
        # Initialize empty lists to store countries, categories, and activities
        categories = []
        countries = []
        activities = []
        try:
            # Fetch all countries and categories from the database
            countries_result = db.session.execute(db.select(Country)).scalars().all()
            categories_result = db.session.execute(db.select(Category)).scalars().all()
            
            # Convert country objects to dictionaries if query returned results
            if countries_result:
                countries = [object_as_dict(country) for country in countries_result]   
            
            # Convert category objects to dictionaries if query returned results
            if categories_result:  
                categories = [object_as_dict(category) for category in categories_result]
                
                # Loop through each category to attach its activities
                for category in categories:
                    try: 
                        # Query activities where category name matches
                        activities_result = db.session.execute(
                            db.select(Activity).filter_by(category=category["name"])
                        ).scalars().all()
                        
                        # Convert activities to dictionary form if found
                        if activities_result:
                            activities = [object_as_dict(activity) for activity in activities_result]
                        
                        # Add list of activities to the corresponding category
                        category["activities"] = activities
                        
                        #print(category)
                        
                    except Exception as e:
                        # Print error if activity query fails
                        print("activities_result error: ", str(e))           

        except Exception as e:
            # Print error if country or category query fails
            print("categories_result or countries_result error: ", str(e))          
        
        # Render the selection page template with the countries and categories data
        return render_template('selection/selection_base.html', categories=categories, countries=countries)       
    
    # Handle POST request from client-side JavaScript
    if request.method == 'POST':
        # Parse incoming JSON data sent via fetch
        data = request.get_json()
        
        # Log received preference data for debugging
        # print("budget:", data["Budget"])
        # print("passports:", data["Passports"])
        # print("visas:", data["Visas"])
        # print("activities:", data["Activities"])
        
        # Expected data format from client:
        """ 
        data = [
            Budget: value,
            Passports: [country 1, ... country n],
            Visas: [country 1, ... country n],
            Activities: [
                {
                    categoryName: category 1 name,
                    categoryActivities: [
                        {
                            activityName: activity 1 name,
                            activityPriority: activity 1 priority
                        }
                        ...
                        {
                            activityName: activity n name,
                            activityPriority: activity n priority
                        }
                    ]
                } 
                ...                
                {
                    categoryName: category n name,
                    categoryActivities: [
                        {
                            activityName: activity 1 name,
                            activityPriority: activity 1 priority
                        }
                        ...
                        {
                            activityName: activity n name,
                            activityPriority: activity n priority
                        }
                    ]
                }
            ]
        ] 
        """
        
        # TODO: Logic here to process and store user preferences in the database...
        
        for activity_info in data["Activities"]:
            try:
                category_name = activity_info["categoryName"]
                category_obj = Category.query.filter_by(name=category_name).first()
                category_id = category_obj.id
                category_activities = activity_info["categoryActivities"]
            except Exception as e:
                print("Category not found")
            for activity in category_activities:
                #Gets the activity name selected
                activity_name = activity["activityName"]
                activity_obj = Activity.query.filter_by(name=activity_name).first()
                activity_id = activity_obj.id
                #Gets the priority associated with the activity selected
                activity_priority = int(activity["activityPriority"])
                user_activity_preference = UserActivityPreference(user_id=current_user.id, category_id=category_id, priority=activity_priority,activity_id=activity_id )
                db.session.add(user_activity_preference)
        # Adds user preference to database.
        db.session.commit()
        
        
        # Return a success response as JSON
        return jsonify({"message": "POST received", "status": "success"})


@app.route('/details-page')
def recommendation_details():
    
    """Render website's signup quiz page."""
    return render_template('recommendations/recommendation_details.html')