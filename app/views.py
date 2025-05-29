from app import app, db,login_manager
from flask import render_template, request, redirect, url_for, flash,jsonify
from flask_bcrypt import Bcrypt
import datetime
from app.models.user import User
from app.services.reccommendation_service import RecommendationService
from app.models.user_preference import UserPreference
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
        recommend_service = RecommendationService()
        

        pass
    return render_template('destinations_pg/destinations.html')

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
