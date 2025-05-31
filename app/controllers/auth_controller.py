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
        user = User(email=email, name=name, password_hash=pass_hash, date_of_birth=date_of_birth, port_of_origin=port, country_residence= country_of_residence)

        #Add user to database
        db.session.add(user)
        db.session.commit()

        #Redirect user to the quiz page
        return redirect(url_for('login'))
    #render the signup page
    return render_template('account_actions/sign_up_base.html')
        

@app.route('/login', methods=['POST', 'GET'])
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
            return redirect(url_for('selection'))
            # return jsonify({"Status": 200, "Message": "User logged in"})
        # return redirect(url_for('selection'))
        return jsonify({"Status": 400, "Message": "Incorrect password"})
    return render_template("account_actions/login.html")

@login_required
@app.route('/logout' , methods=['POST'])
def logout():
    logout_user()
    return({"Status": 200, "Message": "User logged out"})



@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

