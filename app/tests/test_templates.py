from app import app, db,login_manager
from flask import render_template, request, redirect, url_for, flash,jsonify,session


@app.route('/selection-test')
def selection_test():
    """Render website's preference selection page."""
    return render_template('selection_pg/selection_base.html')

@app.route('/clear-session')
def clear_session():
    session.clear()
    return "Session cleared"
