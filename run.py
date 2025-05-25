"""This file runs the application.

This module is used to run the application.
It imports the create_app function from the app module and creates an instance of the application."""

__author__ = "Akele Benjamin(620130803)"
from dotenv import load_dotenv
load_dotenv()

from flask import render_template
from app import app



if __name__ == '__main__':
    app.run(debug=True)
