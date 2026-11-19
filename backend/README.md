# NutriGuide Backend API (MongoDB Atlas)

Backend server for NutriGuide built with Node.js, Express, and Mongoose, connected to MongoDB Atlas.

## 🔗 MongoDB Atlas Connection

- **Cluster:** `testingnutriguide.onbjpon.mongodb.net`
- **Username:** `psubitsha2005_db_user`
- **Database:** `nutriguide`
- **URI Structure:**
  ```env
  MONGODB_URI=mongodb+srv://psubitsha2005_db_user:Subi_in_245@testingnutriguide.onbjpon.mongodb.net/nutriguide?retryWrites=true&w=majority
  ```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (already pre-configured with the credentials):
```bash
cp .env.example .env
```

### 3. Test MongoDB Atlas Connection
Run the connection test script:
```bash
npm run test:db
```

### 4. Seed MongoDB Collections
Populate all collections with sample data for user `"subi"` (`Subitsha P`) from the JSON files:
```bash
npm run seed
```

### 5. Start the Server
- Development (watch mode):
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```
Server runs at `http://localhost:5000`.

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status & endpoint directory |
| `GET` | `/api/health` | Service & MongoDB connection health check |
| `POST` | `/api/auth/login` | Login with email and password |
| `POST` | `/api/auth/register` | Register a new user |
| `GET` | `/api/auth/demo-user` | Retrieve Subi's demo user details |
| `GET` | `/api/profile` | Get Subi's physical & health profile |
| `PUT` | `/api/profile` | Update body metrics and diet goals |
| `GET` | `/api/foods` | Browse and filter food items |
| `GET` | `/api/recipes` | Browse recipe catalog with filters |
| `GET` | `/api/recipes/:recipe_id`| Get specific recipe details |
| `GET` | `/api/meal-plans` | Fetch active weekly meal plan |
| `POST` | `/api/meal-plans` | Save a customized meal plan |
| `GET` | `/api/dashboard` | Get today's nutrition logs & target |
| `GET` | `/api/history` | Get 7-day or 30-day nutrition intake logs |
| `GET` | `/api/baby` | Get child nutrition tracker (baby Ananya) |
| `POST` | `/api/baby/log` | Add feeding log for child |

---

## 🗄️ Database Collections & Models

- `users`: User accounts and credentials.
- `profiles`: Health profile, body metrics (BMI, BMR, TDEE, Calorie Target), allergies, liked recipes.
- `foods`: Categorized food items with calorie, macro, and micronutrient data.
- `recipes`: South & North Indian recipes with ingredients and cooking instructions.
- `mealplans`: Weekly meal schedules.
- `nutritionlogs`: Daily logged meals, calorie totals, and water intake.
- `childprofiles`: Infant/toddler feeding preferences and daily logs.
