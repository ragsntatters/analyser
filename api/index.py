from flask import Flask, request, jsonify
from check_wordpress import check_wordpress
import os
from functools import wraps
import time
from datetime import datetime, timedelta

app = Flask(__name__)

# Simple in-memory rate limiting
rate_limits = {}

def rate_limit(limit_per_day):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            now = datetime.now()
            ip = request.remote_addr
            
            # Clean up old entries
            for key in list(rate_limits.keys()):
                if rate_limits[key]['reset'] < now:
                    del rate_limits[key]
            
            # Check/initialize rate limit for IP
            if ip not in rate_limits:
                rate_limits[ip] = {
                    'count': 0,
                    'reset': now + timedelta(days=1)
                }
            
            # Check if limit exceeded
            if rate_limits[ip]['count'] >= limit_per_day:
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'reset': rate_limits[ip]['reset'].isoformat()
                }), 429
            
            # Increment counter
            rate_limits[ip]['count'] += 1
            
            return f(*args, **kwargs)
        return wrapped
    return decorator

@app.route('/api/check-wordpress', methods=['POST'])
@rate_limit(1000)  # 1000 requests per day per IP
def wordpress_check():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
        
    try:
        is_wordpress = check_wordpress(data['url'])
        return jsonify({'isWordPress': is_wordpress})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
