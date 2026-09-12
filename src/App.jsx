import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

import Home from './pages/Home.jsx'
import CreateBounty from './pages/CreateBounty.jsx'
import ExploreBounties from './pages/ExploreBounties.jsx'
import BountyDetails from './pages/BountyDetails.jsx'
import ReviewBounty from './pages/ReviewBounty.jsx'
import ManageBounty from './pages/ManageBounty.jsx'
import ApplyBounty from './pages/ApplyBounty.jsx'
import FindWork from './pages/FindWork.jsx'
import SubmitWork from './pages/SubmitWork.jsx'
import MyBounties from './pages/MyBounties.jsx'
import HireSomeone from './pages/HireSomeone.jsx'
import NotFound from './pages/NotFound.jsx'
import Settings from './pages/Settings.jsx'

import {
  syncBounties,
} from './lib/bountyStorage'

import './App.css'

function App() {
  useEffect(() => {
    /*
      Initial sync when the app opens.
    */
    syncBounties()

    /*
      Keep the marketplace synced across devices.
      Every 5 seconds the app checks Supabase for
      new/deleted bounties.
    */
    const syncInterval =
      setInterval(() => {
        syncBounties()
      }, 5000)

    /*
      Sync immediately when the browser tab
      becomes active again.
    */
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          'visible'
        ) {
          syncBounties()
        }
      }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    /*
      Sync immediately when the window
      receives focus.
    */
    const handleFocus = () => {
      syncBounties()
    }

    window.addEventListener(
      'focus',
      handleFocus
    )

    /*
      Clean everything when App unmounts.
    */
    return () => {
      clearInterval(syncInterval)

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )

      window.removeEventListener(
        'focus',
        handleFocus
      )
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Sidebar />

        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/bounty/:id/submit"
            element={<SubmitWork />}
          />

          <Route
            path="/my-bounties"
            element={<MyBounties />}
          />

          <Route
            path="/create"
            element={<CreateBounty />}
          />

          <Route
            path="/find-work"
            element={<FindWork />}
          />

          <Route
            path="/hire"
            element={<HireSomeone />}
          />

          <Route
            path="/explore"
            element={<ExploreBounties />}
          />

          <Route
            path="/bounty/:id"
            element={<BountyDetails />}
          />

          <Route
            path="/bounty/:id/apply"
            element={<ApplyBounty />}
          />

          <Route
            path="/bounty/:id/manage"
            element={<ManageBounty />}
          />

          <Route
            path="/review"
            element={<ReviewBounty />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App