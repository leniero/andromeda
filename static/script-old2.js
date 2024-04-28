// Set up the socket.io connection
const socket = io.connect(window.location.origin);

document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const form = document.getElementById("emotion-form");
  const emotionSelect = document.getElementById("emotion");
  const reasonInput = document.getElementById("reason");
  const largeEmoji = document.getElementById("large-emoji");
  const goToEcloudBtn = document.getElementById("goToEcloudBtn");
  const confirmationMessage = document.getElementById("confirmation-message");

  // Update the large emoji based on the selected emotion
  emotionSelect.addEventListener("change", function () {
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

    const selectedEmotion = emotionSelect.value;
    if (selectedEmotion) {
      largeEmoji.textContent = emotionEmojis[selectedEmotion];
      document.body.style.backgroundColor = emotionColors[selectedEmotion];
    } else {
      largeEmoji.textContent = "😶"; // Default emoji when no emotion is selected
      document.body.style.backgroundColor = "black"; // Default background color
    }
  });

  // Function to handle form submission and send emotion data to the server
  function submitEmotion() {
    const emotion = emotionSelect.value;
    const reason = reasonInput.value.trim();

    if (!reason || reason.length > 80) {
      alert("Please elaborate in 80 characters or less.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = {
          emotion: emotion,
          reason: reason,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          local_time: new Date().toISOString(),
        };

        fetch("/submit_emotion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            form.reset();
            largeEmoji.style.display = "none";
            goToEcloudBtn.style.display = "none";
            confirmationMessage.style.display = "flex";
            setTimeout(() => {
              largeEmoji.style.display = "block";
              goToEcloudBtn.style.display = "block";
              confirmationMessage.style.display = "none";
            }, 3000);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location.");
      }
    );
  }

  // Event listener for form submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitEmotion();
    });
  }

  // Socket events
  socket.on("connect", function () {
    console.log("Connected to the server via WebSocket!");
  });

  socket.on("new_emotion", function (emotionData) {
    console.log("New emotion received:", emotionData);
    // Handle the new emotion data here, if needed
  });

  // Fetch and plot emotions if needed
  fetch("/get_emotions")
    .then((response) => response.json())
    .then((emotions) => {
      // Call a function to plot emotions here, if applicable
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
