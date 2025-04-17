# Full-Stack React AI Lesson Planner

## Getting Started
---
### Prerequisites

Please ensure the following software is installed on your system:

1. [Node.js](https://nodejs.org/en/download)
2. [PostgreSQL](https://www.postgresql.org/download/)
3. [Docker Desktop](https://www.docker.com/get-started/)

> **Note:** After installation, you may need to restart your computer for the changes to take effect.
---
### Cloning the Repository and Installing Dependencies

1. **Clone this repository** (or download the ZIP) and open it in your desired location.
2. **Install frontend dependencies**:
    ~~~sh
    cd frontend
    npm install
    ~~~
3. **Install backend dependencies**:
    ~~~sh
    cd backend
    npm install
    ~~~

> **Note:** Installing all packages will take a while, I recommend running both at the same time in different terminals.
---
### Running the Backend

The backend is an Express.js server (with OpenAPI validation) that connects to a PostgreSQL database in a Docker container.

1. **Start Docker Desktop** so containers can run.
2. Ensure **port 5432** is free. If you have a locally installed PostgreSQL using port 5432, stop it or change its port.
3. In the `backend` folder, rename `.env-sample` to `.env`.
   - This is for demo purposes only; change credentials for production.
4. Build and run the Postgres container (navigate to the backend directory):
    ~~~sh
    docker-compose up -d
    ~~~
5. Start the Express server:
    ~~~sh
    npm start
    ~~~
   - A Swagger UI for testing endpoints is available at **http://localhost:3010**.

> For additional information or troubleshooting, please see the `README` in the `backend` directory.

Be sure to run ```docker-compose down``` when done with backend. This will clean up and close the containerized memory. 

---
### Running the Frontend

The frontend is a React application using Material UI (MUI) components. It fetches data from the backend and integrates with ChatGPT’s API.

1. Make sure all dependencies are installed (see [Cloning the Repository and Installing Dependencies](#cloning-the-repository-and-installing-dependencies)).
2. In the `frontend` directory, run:
    ~~~sh
    npm run dev
    ~~~
3. Open **http://localhost:3000** in your web browser to view the application.
---
#### Connecting to OpenAI’s API

1. Obtain an API key from [OpenAI](https://platform.openai.com/) (requires an account).
2. In the `frontend` directory, create a `.env` file containing:
    ```.env
    VITE_OPENAI_API_KEY=<your_api_key_here>
    ```
3. Save the file. The frontend can now access the OpenAI API, enabling all AI-related functionality.

---
You should now be able to run and test the Full-Stack React AI Lesson Planner locally. If you encounter any issues, please open an issue or refer to the documentation in the respective directories.
