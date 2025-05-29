from app import app
from flask import render_template
###
# Routing for your application.
###

@app.route('/')
def landing():
    """Render website's landing page."""
    return render_template('landing_pg/landing.html')