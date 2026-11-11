import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { applyPreferences, loadPreferences } from './accessibility/preferences'
import App from './App.jsx'
// Por último: os overrides de acessibilidade (atributos data-a11y-* no <html>) precisam vencer o CSS dos componentes
import './styles/accessibility-preferences.css'

// REQ-A32: aplica as preferências salvas antes do primeiro render do React,
// então a primeira pintura já usa o tamanho, o espaçamento e o contraste escolhidos
applyPreferences(loadPreferences())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
