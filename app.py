from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import pandas as pd
import datetime
from dateutil import parser
import csv

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

CSV_FILE = 'emotional_states.csv'

@app.route('/')
def index():
    # Render the main page with the form to record emotions
    return render_template('index.html')

@app.route('/submit_emotion', methods=['POST'])
def submit_emotion():
    try:
        # Extract the data from the request
        data = request.json
        emotion = data.get('emotion')
        text_input = data.get('text_input')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        local_time = data.get('localTime')


        print("Emotion received:", emotion)
        print("Text Input received:", text_input)  # Make sure you are capturing this from the request
        print("Latitude received:", latitude)
        print("Longitude received:", longitude)
        print("Local Time received:", local_time)


        # Validate the data
        if not all([emotion, text_input, latitude, longitude, local_time]):
            return jsonify({'error': 'Missing data'}), 400

        # Format local_time to remove 'Z' if present
        if local_time.endswith('Z'):
            local_time = local_time.rstrip('Z')
        local_time = parser.isoparse(local_time).strftime('%Y-%m-%d %H:%M:%S')


        print("Emotion received:", emotion)
        print("Text Input received:", text_input)  # Make sure you are capturing this from the request
        print("Latitude received:", latitude)
        print("Longitude received:", longitude)
        print("Local Time received:", local_time)


        # Append data to CSV
        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([emotion, text_input, latitude, longitude, local_time])

        # Broadcast update to all clients
        socketio.emit('new_emotion', {
            'emotion': emotion,
            'text_input': text_input,
            'latitude': latitude,
            'longitude': longitude,
            'local_time': local_time
        })

        # Confirmation message
        return jsonify({'status': 'It\'s Out!'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    socketio.run(app, debug=True)
