from import_countries import add_countries
from import_cities import add_cities
from import_activites import add_activities
from import_hotels import add_hotels
from import_all_visas import add_visas
from import_airports import add_airports
from add_categories import add_categories
from generate_user_prefs import generate_user_preferences
from import_user import generate_users

def main():
    # Adds countries, cities, activites and hotels to the database
    add_countries()
    add_cities()
    add_activities()
    add_categories()
    add_hotels()
    add_visas()
    add_airports()
    generate_users()
    generate_user_preferences()
if __name__=="__main__":
    main()