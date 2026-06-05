import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import CreateAsset from './pages/CreateAsset'
import InspectionUpload from './pages/InspectionUpload'
import InspectionDetails from './pages/InspectionDetails'
import Tickets from './pages/Tickets'
import TicketDetails from './pages/TicketDetails'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/new" element={<CreateAsset />} />
            <Route path="/inspection/upload" element={<InspectionUpload />} />
            <Route path="/inspection/:id" element={<InspectionDetails />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
