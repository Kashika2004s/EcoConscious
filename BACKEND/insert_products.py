import json
import os
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv

# Load database settings from .env in this script's folder
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Product JSON file should be in the same folder as this script.
JSON_FILE = BASE_DIR / "ecommerce.product_updated (1)(1).json"
CA_FILE = BASE_DIR / "certs" / "ca.pem"

required_vars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME"]
missing = [key for key in required_vars if not os.getenv(key)]
if missing:
    raise RuntimeError(
        "Missing settings in .env: " + ", ".join(missing)
    )

if not JSON_FILE.exists():
    raise FileNotFoundError(
        f"Could not find {JSON_FILE.name}. Put the JSON file in the same "
        "folder as insert_products.py, or update JSON_FILE in this script."
    )

if not CA_FILE.exists():
    raise FileNotFoundError(
        f"TiDB CA certificate not found at {CA_FILE}. "
        "Make sure certs/ca.pem exists."
    )

# Read product data
with JSON_FILE.open("r", encoding="utf-8") as file:
    products = json.load(file)

if not isinstance(products, list):
    raise ValueError("The JSON file must contain a list of products.")

connection = mysql.connector.connect(
    host=os.environ["DB_HOST"],
    port=int(os.environ.get("DB_PORT", "4000")),
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASS"],
    database=os.environ["DB_NAME"],
    ssl_ca=str(CA_FILE),
    ssl_verify_cert=True,
)

insert_sql = """
INSERT INTO products (
    id, name, description, price, category, image, inStock,
    carbonFootprint, materialSourcing, recyclability, waterUsage,
    energyEfficiency, biodegradability, durability, ecoScore, productType
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
)
"""

try:
    cursor = connection.cursor()
    inserted = 0

    for item in products:
        # MongoDB export stores the original ID as {"$oid": "..."}.
        raw_id = item.get("id") or item.get("_id")
        if isinstance(raw_id, dict):
            raw_id = raw_id.get("$oid")

        # Preserve the original ID when available; otherwise create one.
        product_id = str(raw_id) if raw_id else os.urandom(16).hex()

        values = (
            product_id,
            item["name"],
            item.get("description"),
            item.get("price", 0.0),
            item.get("category"),
            item.get("image"),
            item.get("inStock", True),
            item.get("carbonFootprint", 0.0),
            item.get("materialSourcing"),
            item.get("recyclability", 0),
            item.get("waterUsage"),
            item.get("energyEfficiency"),
            item.get("biodegradability", 0),
            item.get("durability"),
            item.get("ecoScore", 0.0),
            item.get("productType"),
        )
        cursor.execute(insert_sql, values)
        inserted += 1

    connection.commit()
    print(f"Success: inserted {inserted} products into TiDB.")

except Exception:
    connection.rollback()
    raise

finally:
    if "cursor" in locals():
        cursor.close()
    connection.close()
