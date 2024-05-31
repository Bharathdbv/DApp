import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { canteenAbi, canteenAddress } from './constants/constants'; // Assuming you have these constants
import Login from './components/Login';
import Connected from './components/Connected';
import './App.css';

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (window.ethereum) {
            handleConnectWallet();
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    async function handleConnectWallet() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts");
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setProvider(provider);
            setAccount(address);
            setIsConnected(true);
            console.log("MetaMask Connected: " + address);
        } catch (err) {
            console.error(err);
        }
    }

    function handleAccountsChanged(accounts) {
        if (accounts.length > 0 && account !== accounts[0]) {
            setAccount(accounts[0]);
        } else {
            setIsConnected(false);
            setAccount(null);
        }
    }

    return (
        <div className="App">
            {isConnected ? (
                <Connected
                    provider={provider}
                    account={account}
                    canteenAddress={canteenAddress}
                    canteenAbi={canteenAbi}
                />
            ) : (
                <Login connectWallet={handleConnectWallet} />
            )}
        </div>
    );
}

export default App;