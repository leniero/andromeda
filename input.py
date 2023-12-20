from flask import Flask, request, render_template_string

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Handle the form submission
        emotion = request.form.get('emotion')
        reason = request.form.get('reason')
        # Process the data as needed
        print(f'Emotion: {emotion}, Reason: {reason}')
        # Here you can redirect to a new page or handle data
    # HTML content with inline CSS
    return render_template_string('''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Emotion Tracker</title>
        <style>
            body { text-transform: uppercase; /* other styles */ }
            #emotion, #reason, button { width: 100%; /* other styles */ }
        </style>
    </head>
    <body>
        <header>
            <h1>Right here, right now, I feel...</h1>
        </header>
        <form method="post">
            <select id="emotion" name="emotion">
                <option value="Anger">Anger</option>
                <!-- other options -->
            </select>
            <input type="text" id="reason" name="reason" placeholder="I feel this way because...">
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
    ''')

if __name__ == '__main__':
    app.run(debug=True)
