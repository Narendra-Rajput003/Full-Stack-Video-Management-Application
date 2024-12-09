# Video Management Application

A full-stack application for recording, storing, and playing videos with a beautiful, responsive interface.

![Demo App](https://www.imghippo.com/i/bpN4483VKg.png)

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Axios

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Multer

## Features

- 📹 Record videos directly from your browser
- 🎬 Play recorded videos with a custom video player
- 📊 Dashboard to view all recorded videos
- 🎨 Beautiful, responsive UI with animations
- 🔒 Secure video storage and streaming

## Setup

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Narendra-Rajput003/Full-Stack-Video-Management-Application
```

2. Install dependencies:

```bash
cd video-management
npm install
```
3. Create a `.env` file in the `video-management` directory and add the following environment variables:

```bash
MONGODB_URL = "mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
PORT = 5000
```

4. Start the server:

```bash
npm run dev 
```

5. Open your browser and navigate to `http://localhost:5173` to access the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
