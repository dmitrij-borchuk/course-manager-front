import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Metric } from 'web-vitals'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { sendToAnalytics } from './utils/analytics'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(reportWebVitalsToAnalytics)

function reportWebVitalsToAnalytics({ id, name, value }: Metric) {
  sendToAnalytics({
    event: name,
    event_category: 'Web Vitals',
    event_value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate
  })
}
