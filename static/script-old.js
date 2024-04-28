// Assuming you've set up socket.io on the backend and it's necessary for real-time features
const socket = io.connect(window.location.origin);

// Function to handle form submission and send emotion data to the server
function submitEmotion() {
    const emotionSelect = document.getElementById('emotion');
    const emotion = emotionSelect ? emotionSelect.value : null; // Make sure the element exists
    const textInput = document.getElementById('reason');
    const textValue = textInput ? textInput.value.trim() : '';

    // Check if the text input is valid
    if (!textValue || textValue.length > 80) {
        alert('Please elaborate in 80 characters or less.');
        return; // Exit the function if validation fails
    }

    // Get the current geolocation and then submit the data
    navigator.geolocation.getCurrentPosition(position => {
        const data = {
            emotion: emotion,
            text_input: textValue,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            local_time: new Date().toISOString()
        };

        console.log("Emotion data to be sent:", data);

 // Send the emotion data to the backend
    fetch('/submit_emotion', {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(data) // Convert the data to a JSON string
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        console.log('Success:', data); // Log the response data
        
        // Clear the form and hide elements here
        const form = document.querySelector('#emotion-form'); // replace '#formId' with your form's selector
        form.reset();

        // Hide elements
        const elementToHide = document.querySelector('#large-emoji'); // replace '#elementId' with your element's selector
        elementToHide.style.display = 'none';
        console.log('Element hidden'); // Should log 'Element hidden'

        // Display the confirmation message only after successful data submission
        const confirmationMessage = document.getElementById('confirmation-message');
        confirmationMessage.style.display = 'flex';
        document.body.classList.add('confirmation-active'); // Add this line
        
        
        // After 3 seconds, hide the message and remove the class
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);



        })
        .catch((error) => {
            console.error('There has been a problem with your submission:', error);
        });
   
         }, (error) => {
        // Handle the error if geolocation fails
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location.');
    });



 function updateGraph(data) {
    // Assuming data is an array of emotions
    // Call plotEmotions to update the graph
    plotEmotions(data);
}

// Listener for socket events to update the graph
socket.on('update_graph', function(data) {
    // Assuming you have a function to update the graph
    updateGraph(data);
});

// Function to plot emotions
function plotEmotions(emotions) {
    const container = document.getElementById('emotions-container');
    // Clear previous emotions
    container.innerHTML = '';
    // Plot each emotion as a circle
    emotions.forEach(emotion => {
        const circle = document.createElement('div');
        circle.className = 'emotion-circle';
        circle.innerText = emotion.emotion; // Or any other property
        // You can set the circle style based on the emotion properties
        container.appendChild(circle);
    });
}

// DOMContentLoaded event to set up form submission handling
document.addEventListener("DOMContentLoaded", function() {
    if (document.body.id === 'index') {
    const form = document.getElementById('emotion-form');

    // Ensure the form exists before adding event listener
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEmotion();

        });
    }
};
    // Get emotions from the backend and plot them when the page loads
    fetch('/get_emotions')
        .then(response => response.json())
        .then(data => {
            plotEmotions(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})}





document.addEventListener('DOMContentLoaded', function() {
    if (document.body.id === 'index') {
    console.log('Script loaded');
    const emotionSelectElement = document.getElementById('emotion');
    const emotionColors = { 'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
    'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
    'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
    'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
    'Pride': 'darkviolet' };

    const largeEmojiElement = document.getElementById('large-emoji');
    const emotionEmojis = {
        'Anger': '😡',
        'Contempt': '😒',
        'Disgust': '🤢',
        'Envy': '😐',
        'Guilt': '😣',
        'Shame': '😳',
        'Fear': '😨',
        'Sadness': '😢',
        'Surprise': '😲',
        'Interest': '🧐',
        'Hope': '🙂',
        'Relief': '😮‍💨',
        'Satisfaction': '😊',
        'Joy': '😆',
        'Elation': '😌',
        'Pride': '🥹'
    }

    
    
    emotionSelectElement.addEventListener('change', function() {
        const selectedEmotion = this.value;
        if (selectedEmotion) {
            largeEmojiElement.textContent = emotionEmojis[selectedEmotion];
            const color = emotionColors[selectedEmotion];
            if (color) {
                document.body.style.backgroundColor = color;
            }
        } else {
            largeEmojiElement.textContent = '😶'; // Default emoji when no emotion is selected
            document.body.style.backgroundColor = 'black'; // Default background color when no emotion is selected
        }

    });

}});

document.addEventListener('DOMContentLoaded', function() {
  // Initialize socket connection to the server
  var socket = io();

  socket.on('connect', function() {
    console.log('Connected to the server via WebSocket!');
  });

  // Listen for 'new_emotion' event from the server
  socket.on('new_emotion', function(emotionData) {
    console.log('New emotion received:', emotionData);
    // Handle the new emotion data, such as updating the UI
  });

  // Your existing code for form submission and other DOM manipulation...
});
