from flask import Flask, render_template, send_from_directory, request, jsonify
import os
from models import db, ContactMessage
from admin import create_admin_app

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-key")

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///portfolio.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
# Initialize the app with the extension
db.init_app(app)

# Create all tables
with app.app_context():
    db.create_all()

# Add admin routes
create_admin_app(app)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    if path.startswith('admin'):
        return render_template('404.html'), 404
    return send_from_directory('.', path)

@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    """API endpoint to receive contact form submissions"""
    try:
        # Get data from request
        data = request.json
        
        # Create new contact message
        new_message = ContactMessage(
            name=data.get('name'),
            email=data.get('email'),
            subject=data.get('subject'),
            message=data.get('message')
        )
        
        # Save to database
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Your message has been sent successfully!'
        }), 201
    except Exception as e:
        print(f"Error saving contact message: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'There was an error sending your message. Please try again.'
        }), 500

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)