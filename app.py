from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
     

# Initialize the Flask app
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shopping_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the Product model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

# Define the Cart model
class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

# Initialize the database tables at startup
with app.app_context():
    db.create_all()

# Routes

# Fetch all products
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    product_list = [
        {
            'id': product.id,
            'name': product.name,
            'brand': product.brand,
            'description': product.description,
            'price': product.price,
            'image_url': product.image_url
        } for product in products
    ]
    return jsonify(product_list)

# Add a product (Admin functionality)
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        brand=data['brand'],
        description=data['description'],
        price=data['price'],
        image_url=data['image_url']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product added successfully'}), 201

# User registration
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    new_user = User(email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# Add to cart
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json
    new_cart_item = Cart(user_id=data['user_id'], product_id=data['product_id'], quantity=data['quantity'])
    db.session.add(new_cart_item)
    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully'}), 201

# Fetch cart items for a user
@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    cart_list = [
        {
            'product_id': item.product_id,
            'quantity': item.quantity,
            'product': {
                'name': item.product.name,
                'price': item.product.price,
                'image_url': item.product.image_url
            }
        } for item in cart_items
    ]
    return jsonify(cart_list)

if __name__ == '__main__':
    app.run(debug=True)
