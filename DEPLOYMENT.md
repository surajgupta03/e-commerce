# Nexa Store Deployment

## 1. MongoDB Atlas

Create a MongoDB Atlas cluster and copy the connection string.

Backend environment variable:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

## 2. Deploy Backend on Render

Create a new Web Service in Render and point it to the `backend` folder.

Settings:

- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: `backend`

Environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

After deploy, Render gives you a backend URL like:

```text
https://your-backend-name.onrender.com
```

Test:

```text
https://your-backend-name.onrender.com/api/health
```

## 3. Deploy Frontend on Vercel

Import the repo into Vercel and point it to the `frontend` folder.

Settings:

- Framework Preset: `Create React App`
- Root Directory: `frontend`

Environment variable:

```env
REACT_APP_API_URL=https://your-backend-name.onrender.com/api
```

Redeploy after setting the environment variable.

## 4. Final Step

Update the backend `FRONTEND_URL` value with your actual Vercel domain if it changed after deploy, then redeploy the backend once more.

## Local Development

Frontend `.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Backend `.env`:

```env
MONGO_URI=your_local_or_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```
