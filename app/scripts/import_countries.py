""" This script:
Fetches country data from the Rest Countries API and updates the database.
This script reads the country data from the API, parses it into a list of dictionaries,
and saves the records to the database using the Country model.
The script is designed to be run as a standalone script."""

#Command to run this script: 
#python  app\scripts\import_countries.py
__author__ = "Akele Benjamin(620130803)"
import os, sys
from pathlib import Path
from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).parents[2]   
sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(str(PROJECT_ROOT / ".env"))

from app import create_app, db
from app.models.country import Country
from app.services.restcountries_client_service import RestCountriesClient

def add_countries():
    app = create_app()
    with app.app_context():
        #fetch from the external API
        client = RestCountriesClient()
        countries = client.get_countries()
        print(f"Fetched {len(countries)} countries from Rest Countries API.")
        file = open("no_image.txt", "w")

        # upsert each country
        for entry in countries:
            iso = entry["country_code"]

            # country = Country.query.filter_by(iso_code=iso).first()
            image_name = entry["name"].lower()
            if os.path.isfile(f"app/static/assets/images/countries/{image_name}.1.jpg"):
               image = f"{image_name}.1.jpg"
            else:
               image="no image"
               country_name = entry["name"]
               file.write(f"{country_name}\n")
            
                   
               

            # if country:
            #     # update existing
            #     country.name           = entry["name"]
            #     country.demonym        = entry["demonym"]
            #     country.continent      = entry["continent"]
            #     country.continent_code = entry["continent_code"]
            # else:
                # insert new
            name = entry["name"]
            print(name.encode("utf-8"))
            escape_name = f"{name}"
            country = Country(
                name=escape_name,
                demonym=entry["demonym"],
                iso_code=iso,
                continent=entry["continent"],
                continent_code=entry["continent_code"],
                img= image
            )
            db.session.add(country)

        #commit everything in one transaction
        file.close()
        db.session.commit()
        print("Database has been updated with country data.")
