#Command to run this script:
# python  app\scripts\import_all_visas.py
__author__ = "Akele Benjamin(620130803)"
import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import aiohttp
import time

PROJECT_ROOT = Path(__file__).parents[2]   
sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")       

semaphore = asyncio.Semaphore(10)

from app import create_app, db
from app.models.country import Country
from app.services.visa_service import (
    fetch_html,
    extract_main_html,
    extract_visa_info,
    save_visa_policies
)


async def process_country(origin_name: str, slug: str, session: aiohttp.ClientSession):
    async with semaphore:
        try:
            raw_html  = await fetch_html(slug, session)
            main_html = extract_main_html(raw_html)
            visa_data = extract_visa_info(main_html)
            save_visa_policies(origin_name, visa_data)
            print(f"[OK] {origin_name}")
        except Exception as e:
            with open("errors.txt", "a") as file:
                file.write(f"{origin_name}: {e!r}\n")
            print(f"[ERROR] {origin_name}: {e!r}")


async def run_tasks(countries):
    async with aiohttp.ClientSession() as session:
        tasks = [
            process_country(c.name, c.demonym, session)
            for c in countries if c.demonym
        ]
        await asyncio.gather(*tasks)


def add_visas():
    app = create_app()
    with app.app_context():
        countries = Country.query.all()
        print(f"Processing {len(countries)} countries...")

        start = time.time()
        asyncio.run(run_tasks(countries))
        end = time.time()

        print(f"Completed in {end - start:.2f} seconds")



