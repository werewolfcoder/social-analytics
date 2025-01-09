import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { json } from 'express'
import dotenv from 'dotenv'
dotenv.config()
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    'process.env.FLOW_ID':JSON.stringify(process.env.FLOW_ID),
    'process.env.LANGFLOW_ID':JSON.stringify(process.env.LANGFLOW_ID),
    'process.env.APPLICATION_TOKEN':JSON.stringify(process.env.APPLICATION_TOKEN),
    'process.env.GOOGLE_API_KEY':JSON.stringify(process.env.GOOGLE_API_KEY)
  }
})
