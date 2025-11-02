import React, { useEffect } from 'react'
import Nav from './components2/Nav'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import { init, readName } from './slices/contractSlice'
import { useAppKitAccount } from '@reown/appkit/react'

export default function App() {

    const dispatch = useDispatch()
    const { address } = useAppKitAccount();

  useEffect(() => {
    dispatch(init()).then(() => {
      if (address) {
        dispatch(readName({ address }));
      } else {
        dispatch(readName({ address: "0x0000000000000000000000000000000000000000" }));
      }
    });
  }, [dispatch, address]);
    return (
        <div>
             <Toaster position="top-right" reverseOrder={false} />
            <Nav />



                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/:id" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tree" element={<Tree />} />
                    <Route path="/trade" element={<Trade />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/asset" element={<Asset />} />
                    <Route path="/history" element={<History />} />

                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>























        </div >
    )
}
