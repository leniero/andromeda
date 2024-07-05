# Andromeda
## Emotion Tracker and Visualiser
![andromeda](andromeda-cover.png)

## Context and Need
In today's fast-paced digital world, individuals often struggle to process and articulate their emotions. Traditional social networks are primarily focused on connection through personal information sharing and curated images, which can sometimes contribute to a superficial understanding of one's emotional state. Without a dedicated platform to anonymously express and visualise emotions, users may miss the opportunity for deeper self-reflection and empathy.

Andromeda aims to explore a new form of online social network based primarily on anonymous geo-expressions of emotion. By promoting deeper self-reflection and empathy, Andromeda enables users to leave behind digital "messages" in public spaces, akin to writing on toilet stall doors or creating street graffiti. The application simplifies emotional expression through colours and 2D/3D objects, with optional text expressions, both ready for AR integration and expansions down the line.

By addressing the existing limitations and introducing innovative features, Andromeda will not only enhance emotional awareness and empathy among its users but also create a unique platform for anonymous, yet impactful emotional expression. This application bridges the gap between the digital and physical world, fostering a deeper connection through shared emotional experiences.

The original Andromeda application effectively logs and visualizes user emotions but lacks scalability, modern architecture, and advanced features required for a robust full-stack application. The refactoring will address these gaps, enhance user experience, and provide a more secure and maintainable codebase.

 I will expand the existing Andromeda prototype to meet requirements, including N-Tier architecture, RESTful API, enhanced CRUD operations, improved UI/UX, authentication, authorization, testing, deployment, and comprehensive documentation. The project will also include creative visual animations and ever-evolving digital sculptures using Three.js with plans to expand on it with shaders and WebXR.

## Features
1. **Emotion Tracking**: Users can log their emotions through a simple interface, selecting from a range of emotions represented by colours, emojis, and a short text description.
2. **Geo-Expression**: Emotions are tagged with geolocation data, allowing users to leave behind anonymous emotional markers in specific locations.
3. **Interactive Visualisation**: Utilises Three.js and shaders to create dynamic, evolving digital sculptures that visually represent the collective emotions of users over time.
4. **Enhanced Security**: Implements modern authentication and authorisation mechanisms to ensure user data privacy and security.
5. **Improved UI/UX**: A focus on intuitive and aesthetically pleasing design to enhance user engagement and experience.
6. **AR Integration**: Emotions and their visual representations will also be designed to be viewed in augmented reality with WebXR, bringing digital emotional landscapes to a new dimension.

## User Interface
 The user interface will include a dashboard for tracking emotions with a form for submitting new entries, and a 3D visualization area. The design will be responsive, intuitive, and visually appealing. Wireframes are provided below:
 
### Prototype Walkthrough
[Prototype Video Demo](https://vimeo.com/942423078)

### Wireframes
![Wireframes](wireframes.png)

## Architecture
**The architecture will follow the N-Tier structure, including**:
- **Client Tier**: React SPA
- **Server Tier**: Node.js/Express API
- **Database Tier**: MongoDB

### Architecture Diagram
```plaintext
+----------------+         +----------------+         +----------------+
|  Client (SPA)  | <-----> |  Server (API)  | <-----> |  Database (DB) |
|                |         |                |         |                |
| React, Three.js|         | Node.js,       |         | MongoDB        |
|                |         | Express        |         |                |
+----------------+         +----------------+         +----------------+
```

## RESTful Routing
**Routes**:
- **GET /emotions**: Retrieve all emotional entries
- **POST /emotions**: Create a new emotional entry
- **PUT /emotions/:id**: Update an emotional entry
- **DELETE /emotions/:id**: Delete an emotional entry

### Route Details
- **GET /emotions**
  - **Request Headers**: `{ Authorization: Bearer <token> }`
  - **Response Body**: `{ emotions: [ { id, emotion, reason, location, date }, ... ] }`
- **POST /emotions**
  - **Request Body**: `{ emotion, reason, location, date }`
  - **Response Body**: `{ id, emotion, reason, location, date }`
- **PUT /emotions/:id**
  - **Request Body**: `{ emotion, reason, location, date }`
  - **Response Body**: `{ id, emotion, reason, location, date }`
- **DELETE /emotions/:id**
  - **Request Headers**: `{ Authorization: Bearer <token> }`
  - **Response Body**: `{ message: 'Entry deleted' }`

## Technologies
- **Frontend**: React, Three.js, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Testing**: Jest, Mocha, Chai
- **Deployment**: AWS/Heroku
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: Role-based access control

## Deployment
The application will be deployed on AWS/Herokuor or similar. Environment variables such as database URI, JWT secret, and API keys will be managed securely using cloud service features.

### Environment Variables
- `MONGODB_URI`
- `JWT_SECRET`
- `API_KEY`

## Documentation
**The project documentation will cover**
1. **Design**: Overview and diagrams of the architecture.
2. **Setup**: Instructions for setting up the development environment.
3. **Running Tests**: How to run unit and integration tests.
4. **Deployment**: Steps to deploy the application to the cloud.
5. **Kanban Board**: Kanban board showing project progress.
6. **Review/Retro**: Summary of the project review and retrospective.

---

## Additional Information

**Creative Visual Animations**: The project will include advanced 3D visualizations using Three.js, shaders, and other relevant libraries to create dynamic representations of user emotions. These visualizations will evolve over time, reflecting the cumulative emotional data of the user.

### Example Visualizations
- **Emotion Sphere**: A dynamic, color-changing sphere representing different emotions.
- **Emotion Wave Shader**: A waveform that changes frequency and amplitude based on emotional category.
- **Ever-evolving Sculpture**: A digital sculpture that evolves over time, incorporating elements from various emotions logged by the user.

### Technologies for Visualizations
- **Three.js**: For creating and rendering 3D graphics.
- **Shaders**: For creating advanced visual effects.
- **D3.js**: For data-driven visualizations.
- **WebXR**: For Augmented Reality expansion.

### Implementation Plan
1. **Initial Setup**: Set up Three.js and integrate with React.
2. **Basic Visualization**: Create basic visual elements (sphere, wave, sculpture).
3. **Data Integration**: Integrate emotional data to dynamically alter visual elements.
4. **User Interaction**: Allow users to interact with visualizations (e.g., zoom, rotate).
5. **Continuous Evolution**: Implement logic for continuous evolution of sculptures based on user data over time.

---

## Future Development: Enabling a Social Aspect

To further enhance Andromeda and foster a sense of community among users, the following steps will be taken to implement a social aspect:

### Vision
Users' anonymised emotion data will contribute to a local shared digital sculpture, publicly available for viewing. This feature will function as an emotional "heat map" of their neighbourhood, allowing users to participate in and observe the collective emotional state of their community.

### Objectives
1. **Anonymised Data Contribution**: Ensure users' emotional data is anonymised before being included in the shared digital sculpture.
2. **Localised Visualisation**: Create visual representations of emotional data specific to different neighbourhoods.
3. **Interactive Heat Map**: Develop an interactive 3D heat map to display the collective emotional state of local areas.
4. **Community Engagement**: Encourage user participation and interaction with the shared emotional sculpture.

### Implementation Plan

#### 1. Anonymised Data Collection
- **Data Anonymisation**: Implement a process to anonymise user data before storage.
- **Data Storage**: Use a separate collection in MongoDB for storing anonymised emotional data tagged with geographic coordinates.

#### 2. Localised Visualisation
- **Geolocation**: Utilise geolocation data from user submissions to group emotional data by neighbourhood.
- **Data Aggregation**: Aggregate anonymised emotional data periodically to update the shared digital sculpture.

#### 3. Interactive 3D Heat Map
- **Three.js Integration**: Use Three.js to create an interactive 3D visualisation representing the aggregated emotional data.
- **Colour Coding**: Implement colour coding to represent different emotions, indicating the collective emotional state.
- **Dynamic Scaling**: Adjust the size and intensity of visual elements based on the volume and intensity of emotional data.

#### 4. Community Engagement
- **Public Access**: Host the shared digital sculpture on a public webpage for user exploration.
- **User Interaction**: Enable users to interact with the heat map, zoom in on specific areas, and react to other user's posts.
- **Feedback Loop**: Collect user feedback on the visualisation to continuously improve the feature.