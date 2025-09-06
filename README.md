# sr95v1: React + TypeScript + Vimeo

This project is a clean, modern React app for recording, uploading, and viewing videos using Vimeo. No Supabase or external database is used—authentication is local (or via your preferred provider), and all video storage/listing is handled via Vimeo APIs or local state.

## Features
- Record and upload videos directly to Vimeo
- View your uploaded videos (via Vimeo API or local state)
- Simple authentication (local or placeholder)
- Modern, minimal UI

## Getting Started
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```
3. Configure your Vimeo credentials in a `.env` file (see below).

## Environment Variables
Create a `.env` file in the root with your Vimeo credentials:
```
REACT_APP_VIMEO_CLIENT_ID=your_client_id
REACT_APP_VIMEO_CLIENT_SECRET=your_client_secret
REACT_APP_VIMEO_ACCESS_TOKEN=your_access_token
```

## Customization
- To use a real authentication provider, integrate your preferred auth system.
- For production, secure your Vimeo credentials and use a backend proxy for uploads if needed.

---

This project was generated as a clean rewrite, inspired by your previous work, but with all data handled via Vimeo and local state only.
