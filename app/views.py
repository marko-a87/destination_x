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

@app.route('/')
def landing():
    """Render website's landing page."""
    return render_template('landing_pg/landing.html')

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
@app.route('/selection', methods=['POST'])
def selection():
    """Render website's preference selection page."""
    if request.method == 'POST':
        """Getting the priority assigned to each category"""
        budget_val = request.form.get('budget_slider')
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

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    """Render website's signup page."""
    if request.method == 'POST':
        #Get user credentials from form data
        name = request.form.get('Name')
        email = request.form.get('Email')
        password = request.form.get('Password')
        confirm_password = request.form.get('Confirm-Password')
        currency = request.form.get('Currency')
        port = request.form.get('port')
        date_of_birth = request.form.get('birthdate')
        country_of_residence = request.form.get('Residence')

        #checks to see if user entered data at each of the fields
        if name == None or email == None or password == None or confirm_password == None or currency == None or port == None or date_of_birth == None or country_of_residence == None:
            return redirect(url_for('signup'))
        
        if password != confirm_password:
            flash("Passwords do not match")
            return redirect(url_for('signup'))
        
        #Create a bcrypt object
        bcrypt = Bcrypt(app)

        #Hash the confirmed password from the user
        pass_hash = bcrypt.generate_password_hash(confirm_password).decode('utf-8')
        
        #Creates a user
        user = User(email, name, pass_hash, date_of_birth, port, country_of_residence)

        #Add user to database
        db.session.add(user)
        db.session.commit()

        #Redirect user to the quiz page
        return redirect(url_for('quiz'))
    #render the signup page
    return render_template('account_actions/sign_up_base.html')

@app.route('/login-test')
def login_test():
    """Just for testing"""
    return render_template('account_actions/login.html')

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('Username')
        password = request.form.get('Password')

        if username == None:
            # return render_template("/login.html")
            return jsonify({"Status": 400, "Message": "Enter the username"})
        if password == None:
            return jsonify({"Status": 400, "Message": "Enter the password"})
        
        user = User.query.filter_by(name=username).first()
        bcrypt = Bcrypt()
        check_pass = bcrypt.check_password_hash(user.password_hash, password)
        if user and check_pass:
            login_user(user)
            return jsonify({"Status": 200, "Message": "User logged in"})
        # return redirect(url_for('selection'))
        return jsonify({"Status": 400, "Message": "Incorrect password"})
    return jsonify({"Status" :400, "Message": "Invalid request"})

@login_required
@app.route('/logout' , methods=['POST'])
def logout():
    logout_user()
    return({"Status": 200, "Message": "User logged out"})

@app.route('/quiz')
def quiz():
    """Render website's signup quiz page."""
    return render_template('account_actions/sign_up_quiz_base.html')


@app.route('/details-page')
def destination_details():
    """Render website's signup quiz page."""
    return render_template('destinations_pg/destination_details.html')


@app.route('/about')
def about():
    """Render the website's about page."""
    return render_template('old/old_about.html', name="Mary Jane")


###
# Functions for application.
###

def format_date_joined(yr, mon, day):
    return 0



###
# The functions below should be applicable to all Flask apps.
###

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404
