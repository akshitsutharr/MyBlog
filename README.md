# MyBlog - MERN Stack Blog Application

This is a full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete blog posts
- Rich text editor for writing posts
- Image upload for blog post covers
- Responsive design

## Project Structure

The project consists of two main folders:

- `api` - Backend server using Express.js and MongoDB
- `client` - Frontend application built with React and Vite

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB server
- Git

### Clone the Repository

```bash
git clone https://github.com/akshitsutharr/MyBlog.git
cd MyBlog
```

### Backend Setup

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Create an uploads folder if it doesn't exist:
```bash
mkdir uploads
```

4. Start the server:
```bash
node index.js
```

The API server will run on http://localhost:4000

### Frontend Setup

1. Open a new terminal window and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client application will be available at http://localhost:5173

## Environment Variables

You may need to configure the following environment variables for production deployment:

- MongoDB connection string
- JWT secret key
- CORS settings

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcrypt for password hashing

### Frontend
- React.js
- React Router for navigation
- React Quill for rich text editing
- CSS for styling
- Vite for build tooling

## License

MIT

## Contact

Akshit Suthar - [GitHub](https://github.com/akshitsutharr)
