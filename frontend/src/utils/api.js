// Shared by anything that talks to the FastAPI backend (quotes, lawn availability, admin).
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
