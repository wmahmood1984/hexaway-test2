import React, { useState } from 'react'
import Nav from './components2/Nav'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './components2/Home'
import Auth from './components2/Auth'
import Dashboard from './components2/Dashboard'
import Trade from './components2/Trade'
import Create from './components2/Create'
import Asset from './components2/Asset'
import Tree from './components2/Tree'
import History from './components2/History'
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux'

import { useAppKitAccount } from '@reown/appkit/react'
import Suck from './components2/Suck'
import CreateHistory from './components2/CreateHistory'
import NFTCreationDetails from './components2/NFTCreationDetails'
import Teamtree from './components2/Teamtree'

import NoteMarquee from './components2/Note'

import Lists from './components2/Lists'
import User from './components2/p2p Trade/User'
import Staking from './components2/Staking page/Staking'
import Game from './components2/NFT Prediction game/Game'
import ColorPredictionAdmin from './components2/NFT Prediction game/ColorPredictionAdmin'
import ColorSlotAdmin from './components2/NFT Prediction game/ColorSlotAdmin'

export default function App() {

    const dispatch = useDispatch()
    const { address } = useAppKitAccount();
    const navigate = useNavigate()
    const [createActive, setCreateActive] = useState(false)



    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />
            <Nav createActive={createActive} setCreateActive={setCreateActive} />
            <NoteMarquee />


            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth createActive={createActive} setCreateActive={setCreateActive} />} />
                <Route path="/auth/:id" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tree" element={<Tree />} />
                <Route path="/trade" element={<Trade createActive={createActive} setCreateActive={setCreateActive} />} />
                <Route path="/create" element={<Create />} />
                <Route path="/asset" element={<Asset />} />
                <Route path="/history" element={<History />} />
                <Route path="/suck" element={<Suck />} />
                <Route path="/createhistory" element={<CreateHistory />} />
                <Route path="/nftcreationdetails" element={<NFTCreationDetails />} />
                <Route path="/teamview" element={<Teamtree />} />
                <Route path="/p2p" element={<User />} />
                <Route path="/lists" element={<Lists />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/game" element={<Game />} />
                <Route path="/predictionadmin" element={<ColorPredictionAdmin />} />
                <Route path="/slotadmin" element={<ColorSlotAdmin />} />
            </Routes>
        </div >
    )
}
