// Set up the socket.io connection
const socket = io.connect(window.location.origin);

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const form = document.getElementById("emotion-form");
  const emotionSelect = document.getElementById("emotion");
  const textInput = document.getElementById("text_input");
  const largeEmoji = document.getElementById("large-emoji");
  const confirmationMessage = document.getElementById("confirmation-message");

  // Update the large emoji based on the selected emotion
  emotionSelect.addEventListener("change", function () {
    updateLargeEmoji(emotionSelect.value);
  });

  // Function to update the large emoji and the background color
  function updateLargeEmoji(emotion) {
    
    const emotionColors = { 'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
    'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
    'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
    'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
    'Pride': 'darkviolet' };
    
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

    largeEmoji.textContent = emotion ? emotionEmojis[emotion] : "😶";
    document.body.style.backgroundColor = emotion ? emotionColors[emotion] : "black";
  }

  // Function to handle form submission and send emotion data to the server
  function submitEmotion() {
    const emotion = emotionSelect.value;
    const text_input = textInput.value.trim();

    if (!text_input || text_input.length > 80) {
      alert("Please elaborate in 80 characters or less.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = {
          emotion: emotion,
          text_input: text_input,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          local_time: new Date().toISOString(),
        };

        sendEmotionData(data);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location.");
      }
    );
  }

  // Function to send emotion data to the server
  function sendEmotionData(data) {
    fetch("/submit_emotion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        handleSuccessfulSubmission();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Handle successful data submission
  function handleSuccessfulSubmission() {
    console.log("Emotion submitted successfully");
    form.reset();
    updateLargeEmoji(null);
    confirmationMessage.style.display = "flex";

    // Add this line to set the body class to "confirmation-active"
    document.body.classList.add("confirmation-active"); 

    setTimeout(() => {
      confirmationMessage.style.display = "none";
      
      // Remove the class after the message is gone
      document.body.classList.remove("confirmation-active");
    }, 3000);
  }

  // Event listener for form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitEmotion();
  });

  // Socket events
  socket.on("connect", () => console.log("Connected to the server via WebSocket!"));
  socket.on("new_emotion", (emotionData) => console.log("New emotion received:", emotionData));

  // Load initial emotions
  fetch("/get_emotions")
    .then((response) => response.json())
    .then((emotions) => {
      // This could be a function to plot the initial set of emotions on a graph
      console.log("Initial emotions loaded", emotions);
    })
    .catch((error) => console.error("Error:", error));
});
