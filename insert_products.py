import json
import mysql.connector
import uuid  # Generates unique IDs if missing

# MySQL connection setup
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Kashika4680@",
    database="ecommerce"
)
cursor = conn.cursor()

# JSON file read karo
with open("C:/Users/HP/Downloads/ecommerce.product_updated.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Data Insert Karna
for item in data:
    sql = """INSERT INTO products 
    (id, name, description, price, category, image, inStock, carbonFootprint, 
     materialSourcing, recyclability, waterUsage, energyEfficiency, 
     biodegradability, durability, ecoScore, productType) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    
    values = (
        item.get("id", str(uuid.uuid4())),  # Use existing ID, otherwise generate a unique one
        item["name"],
        item.get("description", None),
        item.get("price", 0.0),
        item.get("category", None),
        item.get("image", None),
        item.get("inStock", 1),  
        item.get("carbonFootprint", 0.0),
        item.get("materialSourcing", None),
        item.get("recyclability", 0),
        item.get("waterUsage", None),
        item.get("energyEfficiency", None),
        item.get("biodegradability", 0),
        item.get("durability", None),
        item.get("ecoScore", 0.0),
        item.get("productType", None)
    )
    
    cursor.execute(sql, values)

conn.commit()
cursor.close()
conn.close()

print("✅ Data successfully inserted into MySQL table!")
