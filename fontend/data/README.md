# NutriGuide MongoDB Seed & Schema Data

This directory contains JSON datasets designed for MongoDB integration with the **NutriGuide – AI-Powered Diet Recommendation System**, customized with sample user **"subi"**.

---

## 📁 Files & Collection Mapping

| File | Page / Feature | MongoDB Collection | Description |
| :--- | :--- | :--- | :--- |
| [`auth.json`](./auth.json) | `/auth` | `users` | User credentials, roles, email verification for user **subi**. |
| [`profile.json`](./profile.json) | `/profile` | `profiles` | Health metrics (age 23, 162cm, 54kg, vegetarian, peanut allergy) for **subi**. |
| [`dashboard.json`](./dashboard.json) | `/dashboard` | `dashboard_views` | Calculated BMI (20.6), BMR (1320 kcal), TDEE (2046 kcal), and macros for **subi**. |
| [`foods.json`](./foods.json) | `/foods` | `foods` | 13+ staple Indian and global foods with macro/micronutrient breakdown. |
| [`recommendations.json`](./recommendations.json) | `/recommendations` | `recommendations` | Ranked foods, taste-based picks, and allergy filters tailored for **subi**. |
| [`recipes.json`](./recipes.json) | `/recipes` | `recipes` | Regional Indian recipes with ingredients, steps, and condition tags. |
| [`meal-plan.json`](./meal-plan.json) | `/meal-plan` | `meal_plans` | Active 4-meal daily plan hitting the 2050 kcal target for **subi**. |
| [`history.json`](./history.json) | `/history` | `meal_plans_history` | Historical log of saved daily meal plans for **subi**. |
| [`baby.json`](./baby.json) | `/baby` | `children` | Baby Corner child profile ("Ananya", 15 months) and age-stage guide. |

---

## 🚀 Quick Import into MongoDB

### 1. Using MongoDB Compass
1. Connect to your MongoDB cluster (Local `mongodb://localhost:27017` or MongoDB Atlas).
2. Create database: `nutriguide`.
3. In each collection, click **Add Data → Import JSON or CSV file** and select the corresponding `.json` file from this folder.

### 2. Using `mongoimport` CLI
```bash
# Set your connection URI
MONGO_URI="mongodb://localhost:27017/nutriguide"

# Import collections
mongoimport --uri $MONGO_URI --collection users --file data/auth.json --jsonArray
mongoimport --uri $MONGO_URI --collection profiles --file data/profile.json --jsonArray
mongoimport --uri $MONGO_URI --collection foods --file data/foods.json --jsonArray
mongoimport --uri $MONGO_URI --collection recipes --file data/recipes.json --jsonArray
mongoimport --uri $MONGO_URI --collection meal_plans --file data/history.json --jsonArray
mongoimport --uri $MONGO_URI --collection children --file data/baby.json --jsonArray
```
