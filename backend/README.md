# Backend

### What's here...

---

#### OpenAPI
* `api/openapi.yaml`  
  * The OpenAPI schema to be used in validating request/responses to the server.

---

#### SQL
* `sql/databases.sql`  
  * Initializes the databases in the Server and connects to one.
    * (Should create one for test and one for dev)

* `sql/schema.sql`  
  * Initializes the tables and the schema for the database.  
  * **NOTICE**: We only use relational data in columns and then store object data in a JSON Binary column (`JSONB`). For instance, tables have:
    * A **Primary Key** (`UUID`)
    * Any necessary **REFERENCE** columns
    * A **data** `JSONB` column for storing the object's underlying structure.  

  This approach allows for schema flexibility while retaining referential integrity.

* `sql/data.sql`  
  * Contains initial data to load into the Postgres Server.  
  * Useful for creating test data.

---

#### Src (JavaScript)
* `src/app.sql` and `sql/server.sql`  
  * Sets up the Express server and its endpoints; runs SQL queries via JavaScript.

* `src/lesson.sql`  
  * Handles endpoint calls to the "Lessons" object.

* `src/upload.sql`  
  * Handles endpoint calls for uploads (including video uploads).

* `src/transcribe.py`  
  * A Python script that uses OpenAI’s Whisper to transcribe video files uploaded via the app.

* `src/db.js`  
  * Manages all SQL server calls and operations.

---

#### Housekeeping files...
* `.env-sample`  
  * Sample file to demonstrate how to set environment variables.

* `docker-compose.yml`  
  * Configures Docker containers and resources.

---

## Trouble Shooting
* **I cannot connect to the SQL server**:  
  * Make sure Docker Desktop is running, PostgreSQL is installed, and that port **5432** is not in use by another service.
