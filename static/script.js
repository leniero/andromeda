const socket = io.connect('http://' + document.domain + ':' + location.port);

function submitEmotion() {
  const emotion = document.getElementById('emotion-select').value;
  navigator.geolocation.getCurrentPosition(position => {
    const data = {
      emotion: emotion,
      text_input: text_input,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      local_time: new Date().toISOString()
    };
    
      console.log("emotion:", emotion);
      console.log("text_input:", text_input); // Ensure you have a variable capturing the text input
      console.log("latitude:", position.coords.latitude);
      console.log("longitude:", position.coords.longitude);
      console.log("local_time Time:", local_time);

    fetch('/submit_emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  });



    // Listener for elaboration form submission
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const text_input = text_input.value.trim();
      if (text_input.length === 0 || text_input.length > 80) {
          alert('Please elaborate in 80 characters or less.');
      } else {
          submitElaboration(text_input.value, text_input);
      }
  });



}


socket.on('update_graph', function(data) {
  // Update the graph in the frontend
});

// Remove 'Z' if present to avoid timezone issues
if (local_time.endsWith('Z')) {
    local_time = local_time.substring(0, local_time.length - 1);
}
