""" This script:
 imports airport data from a subset of the excel file that is updated daily on https://davidmegginson.github.io/ourairports-data/airports.csv. The entire file was not used because this is a test project.
This script reads the excel file, parses it into a list of dictionaries, and saves the records to the database using the AirportService class."""


#Command to run this script:
# python  app\scripts\import_all_visas.py
__author__ = "Akele Benjamin(620130803)"
import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).parents[2]   
sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")       


from app import create_app, db
from app.models.country import Country
from app.services.visa_service import (
    fetch_html,
    extract_main_html,
    extract_visa_info,
    save_visa_policies
)

async def process_country(origin_name: str, slug: str):
    """Fetch, process and save visa info for one country."""
    try:
        raw_html  = await fetch_html(slug)
        main_html = extract_main_html(raw_html)
        visa_data = extract_visa_info(main_html)
        save_visa_policies(origin_name, visa_data)
        print(f"[OK] {origin_name}")
    except Exception as e:
        print(f"[ERROR] {origin_name}: {e!r}")

async def run_tasks(tasks):
    # Run all tasks concurrently, but wrapped in a coroutine
    await asyncio.gather(*tasks)


def main():
    app = create_app()
    with app.app_context():
        countries = Country.query.all()
        print(f"Processing {len(countries)} countries...")

        # Build list of coroutine tasks
        tasks = [process_country(country.name, country.demonym)
                 for country in countries if country.demonym]

        # Run the async tasks properly
        asyncio.run(run_tasks(tasks))

if __name__ == "__main__":
    main()