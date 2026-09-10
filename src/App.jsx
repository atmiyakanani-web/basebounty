import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'

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

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
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
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App