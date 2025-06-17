from app import app, db, login_manager
from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify, session
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from sqlalchemy.inspection import inspect
import json

from app.models.user import User
from app.services.reccommendation_service import RecommendationService

from app.models.user_activity_preferences import UserActivityPreference
from app.models.categories import Category
from app.models.airport import Airport
from app.models.country import Country
from app.models.city import City
from app.models.hotel import Hotel
from app.models.activity import Activity


def object_as_dict(obj):
    #print("object_as_dict: ", {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs})
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}


@app.route('/selection-test', methods=['POST','GET'])
def selection_test():
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
        return render_template('selection_pg/selection_base.html', categories=categories, countries=countries)       
    
    # Handle POST request from client-side JavaScript
    if request.method == 'POST':
        # Parse incoming JSON data sent via fetch
        data = request.get_json()
        
        # Log received preference data for debugging
        #print("budget:", data["Budget"])
        #print("passports:", data["Passports"])
        #print("visas:", data["Visas"])
        #print("activities:", data["Activities"])
        
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
         
        
        
        # Return a success response as JSON
        return jsonify({"message": "POST received", "status": "success"})

        


@app.route('/recommendations-test')
def recommendations_test():
    """Render website's preference selection page."""
    return render_template('destinations_pg/destinations.html')

@app.route('/clear-session')
def clear_session():
    session.clear()
    return "Session cleared"
