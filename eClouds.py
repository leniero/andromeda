# Import necessary libraries
import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file into a pandas DataFrame
df = pd.read_csv('emotional_states.csv')

# Define a dictionary to map emotions to unique colors
emotion_mapping = {
    'Anger': 'red', 'Contempt': 'orangered', 'Disgust': 'darkorange', 'Envy': 'gold',
    'Guilt': 'yellow', 'Shame': 'yellowgreen', 'Fear': 'green', 'Sadness': 'lightseagreen',
    'Surprise': 'skyblue', 'Interest': 'deepskyblue', 'Hope': 'dodgerblue',
    'Relief': 'blue', 'Satisfaction': 'slateblue', 'Joy': 'mediumslateblue', 'Elation': 'mediumorchid',
    'Pride': 'darkviolet'
}

# Map the 'Emotion' column in the DataFrame to colors
df['Color'] = df['emotion'].map(emotion_mapping)

# Convert 'LocalTime' column to datetime objects and normalize the times
df['local_time'] = pd.to_datetime(df['local_time'])
latest_time = df['local_time'].max()
df['CircleSize'] = (df['local_time'] - latest_time).dt.total_seconds().abs()
df['CircleSize'] = df['CircleSize'] / df['CircleSize'].max() * 500  # Scale for visibility

# Remove rows with NaN values or impute as necessary
df.dropna(inplace=True)

# Initialize a matplotlib figure for plotting
fig, ax = plt.subplots(figsize=(12, 8))

# Plot latitude and longitude on the x and y axes of the scatter plot, respectively
# Use the mapped colors for each emotional state to color the circles
# Vary the size of the circles based on the normalized 'LocalTime'
scatter = ax.scatter(df['longitude'], df['latitude'], s=df['CircleSize'], c=df['Color'], alpha=0.6)

# Create an annotation for hover text
annot = ax.annotate("", xy=(0,0), xytext=(20,20), textcoords="offset points",
                    bbox=dict(boxstyle="round", fc="w"),
                    arrowprops=dict(arrowstyle="->"))
annot.set_visible(False)

# Function to update the annotation on hover
def update_annotate(event):
    vis = annot.get_visible()
    if event.inaxes == ax:
        cont, ind = scatter.contains(event)
        if cont:
            # Update the annotation with the text from 'text_input'
            pos = scatter.get_offsets()[ind["ind"][0]]
            annot.xy = pos
            text = df.iloc[ind["ind"][0]]['text_input']
            annot.set_text(text)
            annot.set_visible(True)
            fig.canvas.draw_idle()
            return
    if vis:
        annot.set_visible(False)
        fig.canvas.draw_idle()

# Connect the event with the update_annotate function
fig.canvas.mpl_connect("motion_notify_event", update_annotate)

# Create a legend that maps the colors back to the emotional states
handles = [plt.Line2D([0], [0], marker='o', color='w', label=emotion,
                      markerfacecolor=color, markersize=10) for emotion, color in emotion_mapping.items()]
plt.legend(handles=handles, title='Emotions')

# Label the axes with 'Latitude' and 'Longitude'
plt.xlabel('Longitude')
plt.ylabel('Latitude')

# Add a title to the plot
plt.title('Visualisation of Emotional States by Geographic Location')

# Use plt.show() to display the plot
plt.show()
