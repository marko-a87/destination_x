from app import app, db, login_manager
from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify, session
from flask_login import LoginManager, login_user, logout_user, current_user, login_required

from app.models.user import User
from app.services.reccommendation_service import RecommendationService

from app.models.user_activity_preferences import UserActivityPreference
from app.models.categories import Category
from app.models.airport import Airport
from app.models.country import Country
from app.models.city import City
from app.models.hotel import Hotel
from app.models.activity import Activity


@app.route('/selection-test')
def selection_test():
    """Render website's preference selection page."""    
    
    categories = []
    countries = []
    
    try:
        categories_result = db.session.execute(db.select(Category)).scalars().all()
        countries_result = db.session.execute(db.select(Country)).scalars().all()
        
        if categories_result: 
            for category in categories_result:
                activities = []
                
                try: 
                    activities_result = db.session.execute(db.select(Activity).filter_by(category=category.name)).scalars().all()
                     
                    if activities_result:
                        activities = activities_result
                        
                except Exception as e:
                    make_response(jsonify({"error": str(e)}), 500)
                
                #print({"category_name": category.name, "category_id": category.id, "category_activities": activities})
                
                categories.append({"category_name": category.name, "category_id": category.id, "category_activities": activities})
        
        
        if countries_result:
            countries = countries_result       

    except Exception as e:
        make_response(jsonify({"error": str(e)}), 500)
    
    finally:
        return render_template('selection_pg/selection_base.html', categories=categories, countries=countries)


@app.route('/recommendations-test')
def recommendations_test():
    """Render website's preference selection page."""
    return render_template('destinations_pg/destinations.html')

@app.route('/clear-session')
def clear_session():
    session.clear()
    return "Session cleared"
