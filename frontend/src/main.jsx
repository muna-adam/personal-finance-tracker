import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from "@/components/ui/toast"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnWindowFocus: false,
      scaleTime: 1000 * 60   // waxay ka dhigan tahay in xogta la keydiyo muddo 1 daqiiqo ah ka hor inta aan la cusbooneysiin
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <Toaster/>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
