from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
import pandas as pd
from os.path import exists
import os
from dateutil.parser import parse

os.environ['FLASK_ENV'] = 'development'

app = Flask(__name__, static_folder='static', template_folder='templates')


app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
CORS(app)  # Enable CORS for all routes

EMOTIONS_FILE = 'emotions.json'
# EMOTIONAL_STATES_CSV = 'emotional_states.csv'  # Path to your CSV file

# Define your event handlers
@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})

# Check if the emotions file exists, if not, create it with an empty list
if not exists(EMOTIONS_FILE):
    with open(EMOTIONS_FILE, 'w') as file:
        json.dump([], file)

# Function to read and convert CSV data to JSON
# def read_csv_data():
#     if exists(EMOTIONAL_STATES_CSV):
#         df = pd.read_csv(EMOTIONAL_STATES_CSV)
#         return df.to_dict(orient='records')  # Convert DataFrame to a list of dictionaries
#     else:
#         return []
 
 
 
@app.route('/node_modules/<path:filename>')
def serve_node_modules(filename):
    return send_from_directory('node_modules', filename)

   
# API endpoint to record an emotion
@app.route('/submit_emotion', methods=['POST'])
def record_emotion():
    #print('Incoming data:', request.data)  # Add this line
    print('Incoming data:', request.json)
    emotion_data = request.json
    try:
        parse(emotion_data['local_time']) 
        # Print the received emotion data to the terminal
        print('Received emotion data:', emotion_data)
        
        with open(EMOTIONS_FILE, 'r+') as file:
            emotions = json.load(file)
            emotions.append(emotion_data)
            file.seek(0)
            file.truncate()
            json.dump(emotions, file, indent=4)
            
        # Emit a 'new_emotion' event to all connected clients
        socketio.emit('new_emotion', emotion_data)  
          
        return jsonify({"status": "success"}), 200
    except ValueError as e:
        print(f'Invalid date format: {e}')
        return jsonify({'error': 'Invalid date format'}), 400
    except Exception as e:
            print(f'Error writing to JSON: {e}')
            return jsonify({'error': str(e)}), 500
    
# API endpoint to retrieve all recorded emotions
@app.route('/get_emotions', methods=['GET'])
def get_emotions():
    try:
        with open(EMOTIONS_FILE, 'r') as file:
            emotions = json.load(file)
        # Print the emotions data to the terminal
        # print('Emotions data:', emotions)
        return jsonify(emotions), 200
    except Exception as e:
        print('Error:', e)  # This will print any errors to the terminal
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    # Render the main page where users record emotions
    return render_template('index.html')

@app.route('/ecloud')
def ecloud():
    # Fetch the emotion data and pass it to the eCloud.html template
    try:
        with open(EMOTIONS_FILE, 'r+') as file:
            emotions = json.load(file)
        print('JSON emotions data:', emotions)  # Print JSON data

        # Read data from CSV and add it to the emotions list
        # csv_emotions = read_csv_data()
        # print('CSV emotions data:', csv_emotions)  # Print CSV data
        # emotions.extend(csv_emotions)  # Merge the two lists
        # print('Combined emotions data:', emotions)

        # Pass merged emotions data to the eCloud template
        return render_template('ecloud.html', emotions=emotions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/home', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Handle the form submission with JSON data
        data = request.json
        emotion = data.get('emotion')
        reason = data.get('reason')
        
        # Validate received data
        if not emotion or not reason:
            return jsonify({'error': 'Missing emotion or reason'}), 400

        # Append data to JSON file
        with open(EMOTIONS_FILE, 'r+') as file:
            emotions = json.load(file)
            emotions.append({'emotion': emotion, 'reason': reason})
            file.seek(0)
            file.truncate()
            json.dump(emotions, file)
        
        print(f'Emotion: {emotion}, Reason: {reason}')
        print('Data added:', data)  # Print data being added
        return jsonify({'status': 'success'}), 200

    
    

@app.route('/get_emotions_csv')
def get_emotions_csv():
    df = pd.read_csv('emotional_states.csv')
    df['local_time'] = pd.to_datetime(df['local_time'])
    latest_time = df['local_time'].max()
    df['CircleSize'] = (df['local_time'] - latest_time).dt.total_seconds().abs()
    df['CircleSize'] = df['CircleSize'] / df['CircleSize'].max() * 500  # Scale for visibility
    df.dropna(inplace=True)
    return jsonify(df.to_dict(orient='records'))    


if __name__ == '__main__':
    socketio.run(app, debug=True)