import { useState } from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import ContractScanner from './Pages/ContractScanner'
import Templates from './Pages/Templates'

const API_KEY = import.meta.env.VITE_OPEN_ROUTER_API_KEY;

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/app/scanner`} element={<ContractScanner apiKey={API_KEY} />} />
          <Route path={`/app/templates`} element={<Templates />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
