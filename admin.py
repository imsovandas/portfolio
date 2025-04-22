from flask import Flask, render_template, request, redirect, url_for, flash, session
import os
from models import db, ContactMessage
import datetime

def create_admin_app(app):
    """
    Add admin routes to the main Flask app
    """
    
    @app.route('/admin/login', methods=['GET', 'POST'])
    def admin_login():
        """Admin login page"""
        # Simple admin login for demo purposes
        # In a real application, this would use proper authentication
        error = None
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            # Very simple authentication for demo
            if username == 'admin' and password == 'sovanadmin':
                session['admin_logged_in'] = True
                return redirect(url_for('admin_messages'))
            else:
                error = 'Invalid credentials. Please try again.'
        
        return render_template('admin/login.html', error=error)
    
    @app.route('/admin/logout')
    def admin_logout():
        """Admin logout"""
        session.pop('admin_logged_in', None)
        return redirect(url_for('admin_login'))
    
    @app.route('/admin/messages')
    def admin_messages():
        """Display all contact form messages"""
        # Check if admin is logged in
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        
        # Get all messages from the database
        messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
        
        return render_template('admin/messages.html', messages=messages)
    
    @app.route('/admin/messages/<int:message_id>/delete', methods=['POST'])
    def delete_message(message_id):
        """Delete a message"""
        # Check if admin is logged in
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        
        message = ContactMessage.query.get_or_404(message_id)
        db.session.delete(message)
        db.session.commit()
        
        flash('Message deleted successfully!', 'success')
        return redirect(url_for('admin_messages'))
    
    @app.template_filter('format_date')
    def format_date(value, format='%B %d, %Y at %I:%M %p'):
        """Format a date time to a readable string"""
        if value is None:
            return ""
        return value.strftime(format)