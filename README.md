# RentEZ


## 📦 RentEZ Backend

This is the backend for the **RentEZ rental listing platform**, built with **Node.js**, **Express**, and **PostgreSQL**. It includes RESTful APIs, file upload support, secure messaging, search & filtering, listing management, and real-time messaging using **Socket.IO**.

---

### 🚀 Features Implemented

* ✅ CRUD for Properties and Listings
* ✅ Image Upload and Gallery Support
* ✅ Search and Filter Listings
* ✅ Reviews and Ratings per Listing
* ✅ Real-time Chat Between Tenants and Landlords (via WebSockets)
* ✅ Google Calendar Integration for Property Viewing Scheduling
* ✅ System Logging and Error Handling
* ✅ Validation with Joi
* ✅ Modularized Code (controllers, routes, db config)

---

### ⚠️ Important Notes (Read First)

#### 🔒 Google Calendar Integration

If you want to test the Google Calendar **scheduling feature**, you **must**:

1. Set up your **Google Developer Console** project.
2. Create OAuth2 credentials.
3. Add the correct client credentials to your `.env` file (see below).

> **Don't want to test Calendar feature?**
> Just comment out or avoid using any routes or frontend components related to scheduling viewings. The app will still run fine without that feature.

---

### 🛠 Prerequisites

* [Node.js](https://nodejs.org/en/) v16 or higher
* [PostgreSQL](https://www.postgresql.org/)
* A `.env` file with required variables (see below)
* [Git](https://git-scm.com/)

---

### 📁 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone repo link
   cd RentEZ
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file in root**

   Example:

   ```env
   PORT=3000
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rentez_app

   # Optional – only needed for calendar
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=your_redirect_uri
   ```

4. **Set up the PostgreSQL database**

   * Create the database:

     ```sql
     CREATE DATABASE rentez_app;
     ```
   * Run the table creation scripts (ask Tamarica if you don’t have the full schema).
   * If any new tables were added (e.g., `messages`, `gallery`, `reviews`), run those specific scripts too.

5. **Run the server**

   ```bash
   npm run dev  # if using nodemon
   ```

   or

   ```bash
   node index.js
   ```

---

### 📦 Directory Structure (Simplified)

```
RentEZ/
│
├── controllers/         # All route logic (listings, chat, calendar, etc.)
├── routes/              # Express route definitions
├── upload.js            # Multer setup for image uploads
├── db.js                # PostgreSQL pool config
├── index.js             # App entry point
├── .env                 # Environment variables
├── public/uploads/      # Uploaded images (create manually if not existing)
├── package.json
└── README.md
```

---

### 🔁 API Endpoints You Can Test (For More message Tamarica)

| Method | Endpoint                            | Description                    |
| ------ | ----------------------------------- | ------------------------------ |
| `POST` | `/api/listing`                      | Create new listing             |
| `PUT`  | `/api/listing/:property_id`         | Update listing                 |
| `GET`  | `/api/listing/search`               | Search listings                |
| `POST` | `/api/listings/:property_id/images` | Upload images                  |
| `GET`  | `/api/messages/conversation/:id`    | Get messages in a conversation |
| `POST` | `/api/messages`                     | Send message                   |
| `GET`  | `/api/calendar/authorize`           | (Calendar) Begin OAuth2 flow   |



### 🧪 Testing Data & Setup

* Use Postman or Thunder Client
* Send requests using `application/json` or `form-data` (for images)
* Ensure your DB has mock tenants, landlords, properties, and conversations if you're testing messaging or reviews

---

### ✅ To-Do for Teammates (IMPORTANT)

* If you clone this repo, remember to:

  * Run `npm install`
  * Add a `.env` file
  * Set up the database tables (ask Tamarica if you're unsure)
  * **Decide whether to use the Google Calendar feature or skip it**


