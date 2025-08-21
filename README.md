# CollEdge - Academic Resource Sharing Platform

**Live Demo:** **[https://colledge-djbt79vif-hemavarni1501s-projects.vercel.app/](https://colledge-djbt79vif-hemavarni1501s-projects.vercel.app/)**

---

## 📖 About The Project

CollEdge is a full-stack MERN application designed to be a centralized hub for college students and staff to share and discover academic resources. It provides a seamless and secure platform for users to upload notes, find study materials, and connect with their peers. The project is built with a modern, scalable architecture, featuring a RESTful API backend and a dynamic, component-based React frontend.

---

## ✨ Key Features

*   **Secure User Authentication:** Role-based (Student/Staff) registration and login system using JSON Web Tokens (JWT) for secure, stateless sessions.
*   **Personalized Dashboards:** Each user gets a personalized dashboard displaying their profile information, statistics, and a list of their own uploaded resources.
*   **Full-Stack File Management:** Users can upload files (notes, documents, etc.) which are linked directly to their account and stored securely.
*   **Protected Routes:** Client-side and server-side protection ensures that sensitive routes like `/dashboard` and `/profile` are only accessible to authenticated users.
*   **Dynamic Resource Searching:** A powerful search functionality allows users to quickly find resources across the entire database.
*   **Responsive & Modern UI:** A clean, intuitive, and fully responsive user interface built with React and modern CSS.
*   **Contact Form:** A functional contact form for user feedback and inquiries.

---

## 🛠️ Tech Stack

This project is built with the MERN stack and other modern technologies.

| Frontend                               | Backend                           | Database       | Deployment       |
| -------------------------------------- | --------------------------------- | -------------- | ---------------- |
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | **Frontend:** ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | **Backend:** ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white) |
| ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) |                |                  |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | ![Bcrypt.js](https://img.shields.io/badge/Bcrypt.js-2A9D8F?style=for-the-badge) |                |                  |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) |                                   |                |                  |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.
*   npm
    ```sh
    npm install npm@latest -g
    ```
*   A MongoDB Atlas account or a local MongoDB installation.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Backend Setup:**
    ```sh
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    PORT=5000
    ```
    Start the backend server:
    ```sh
    npm start
    ```

3.  **Frontend Setup:**
    Open a new terminal window.
    ```sh
    cd client
    npm install
    ```
    Create a `.env` file in the `client` directory and add the API endpoint.

    *   **To connect to the deployed backend (on Render):**
        ```env
        REACT_APP_API_URL=https://your-render-backend-url.onrender.com
        ```
    *   **To connect to your local backend for development:**
        ```env
        REACT_APP_API_URL=http://localhost:5000
        ```
    Start the React development server:
    ```sh
    npm start
    ```
    The application should now be running on `http://localhost:3000`.

---

## 🗺️ Future Enhancements

Here are some features I'm planning to add next:

*   [ ] **Bookmark Resources:** Allow users to "save" or "bookmark" resources they find useful.
*   [ ] **Delete/Manage Uploads:** Give users the ability to delete their own uploads directly from the dashboard.
*   [ ] **Pagination:** Implement pagination for search results and dashboard uploads to handle large amounts of data gracefully.
*   [ ] **User Profile Pictures:** Allow users to upload a custom avatar.
*   [ ] **Admin Panel:** A separate dashboard for 'staff' or 'admin' roles to manage users and content.

---

## 📬 Contact

Hemavarni - [LinkedIn](https://www.linkedin.com/in/hemavarni-sivakumar?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) - hemavarni1501@gmail.com

Project Link: [https://github.com/Hemavarni1501/collEdge-app](https://github.com/Hemavarni1501/collEdge-app)
