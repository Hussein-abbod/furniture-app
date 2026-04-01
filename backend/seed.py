"""
Seed script — run once to populate the database with sample data.
Usage:  python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import engine, SessionLocal, Base
from app.models.admin import Admin
from app.models.product import Product
from app.core.security import get_password_hash

PRODUCTS = [
    # Living Room
    {"name": "Oslo Sofa", "description": "A timeless three-seater sofa with premium linen upholstery and solid oak legs. Perfect for modern living rooms seeking comfort and elegance.", "price": 1299.00, "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "category": "Living Room", "stock": 12, "is_featured": 1},
    {"name": "Fjord Armchair", "description": "Sculptural armchair in natural bouclé fabric. A statement piece that blends Scandinavian minimalism with warm textures.", "price": 649.00, "image_url": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800", "category": "Living Room", "stock": 8, "is_featured": 1},
    {"name": "Birch Coffee Table", "description": "Hand-crafted solid birch coffee table with a waterfall edge. Pairs beautifully with any sofa style.", "price": 429.00, "image_url": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800", "category": "Living Room", "stock": 15, "is_featured": 0},
    {"name": "Ember TV Console", "description": "Low-profile media console with cane-front doors and brass hardware. Seats components up to 65-inch screens.", "price": 899.00, "image_url": "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800", "category": "Living Room", "stock": 6, "is_featured": 1},
    {"name": "Loft Bookshelf", "description": "Open-back bookshelf with five adjustable shelves. Sturdy steel frame with walnut wood planks.", "price": 549.00, "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "category": "Living Room", "stock": 10, "is_featured": 0},

    # Bedroom
    {"name": "Haven Bed Frame", "description": "Upholstered king-size bed frame in deep forest green velvet. Includes padded headboard with brass tufting.", "price": 1499.00, "image_url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800", "category": "Bedroom", "stock": 7, "is_featured": 1},
    {"name": "Drift Nightstand", "description": "Floating nightstand with single drawer and open shelf. Wall-mounted design saves floor space.", "price": 289.00, "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", "category": "Bedroom", "stock": 20, "is_featured": 0},
    {"name": "Atlas Wardrobe", "description": "6-door sliding wardrobe with mirrored panels and integrated LED lighting. Maximum storage, minimal footprint.", "price": 2199.00, "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "category": "Bedroom", "stock": 4, "is_featured": 1},
    {"name": "Cedar Dresser", "description": "Six-drawer dresser in solid cedar with antique brass pulls. Natural grain adds warmth to any bedroom.", "price": 799.00, "image_url": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800", "category": "Bedroom", "stock": 9, "is_featured": 0},

    # Dining Room
    {"name": "Gather Dining Table", "description": "Extendable oval dining table in smoked oak. Seats 6–10 guests. Clean Danish lines, practical functionality.", "price": 1799.00, "image_url": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800", "category": "Dining Room", "stock": 5, "is_featured": 1},
    {"name": "Crest Dining Chair", "description": "Set of 2 upholstered dining chairs with curved backs. Available in four fabric options.", "price": 349.00, "image_url": "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800", "category": "Dining Room", "stock": 24, "is_featured": 0},
    {"name": "Pantry Sideboard", "description": "Large sideboard with three drawers and two cabinets. Solid mango wood with a hand-rubbed finish.", "price": 1149.00, "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "category": "Dining Room", "stock": 6, "is_featured": 0},

    # Office
    {"name": "Focus Desk", "description": "Minimalist standing-height desk with height-adjustable mechanism. Cable management tray included.", "price": 999.00, "image_url": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800", "category": "Office", "stock": 11, "is_featured": 1},
    {"name": "Ergon Chair", "description": "Full ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back.", "price": 699.00, "image_url": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800", "category": "Office", "stock": 14, "is_featured": 0},
    {"name": "Grid Shelving Unit", "description": "Wall-mounted grid shelving in powder-coated steel. Highly customizable for any home office setup.", "price": 379.00, "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", "category": "Office", "stock": 18, "is_featured": 0},

    # Outdoor
    {"name": "Terra Lounge Set", "description": "4-piece outdoor lounge set in weather-resistant rattan with deep-cushion seats. Includes storage ottoman.", "price": 1899.00, "image_url": "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800", "category": "Outdoor", "stock": 3, "is_featured": 1},
    {"name": "Soleil Dining Set", "description": "Outdoor dining table with 4 stackable chairs. Aluminium frame, UV-resistant finish.", "price": 1299.00, "image_url": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800", "category": "Outdoor", "stock": 5, "is_featured": 0},

    # Kitchen
    {"name": "Prep Kitchen Island", "description": "Freestanding kitchen island with butcher block top and two open shelves. Stainless steel towel rail included.", "price": 749.00, "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", "category": "Kitchen", "stock": 7, "is_featured": 0},
    {"name": "Pantry Cabinet", "description": "Tall pantry cabinet with adjustable shelving and soft-close doors. Perfect for storing kitchen essentials.", "price": 599.00, "image_url": "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800", "category": "Kitchen", "stock": 8, "is_featured": 0},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create admin
    if not db.query(Admin).filter(Admin.username == "admin").first():
        admin = Admin(
            username="admin",
            email="admin@furnitureshop.com",
            password_hash=get_password_hash("admin123"),
        )
        db.add(admin)
        print("✅ Admin created — username: admin / password: admin123")

    # Seed products
    existing = db.query(Product).count()
    if existing == 0:
        for p in PRODUCTS:
            db.add(Product(**p))
        print(f"✅ {len(PRODUCTS)} sample products inserted")
    else:
        print(f"ℹ️  {existing} products already exist — skipping seed")

    db.commit()
    db.close()
    print("🚀 Database seeded successfully!")


if __name__ == "__main__":
    seed()
