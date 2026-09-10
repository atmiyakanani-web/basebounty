import { useEffect, useRef, useState } from 'react'
import './WalletButton.css'

function WalletButton() {
  const [account, setAccount] = useState('')
  const [wallets, setWallets] = useState([])
  const [selectedWallet, setSelectedWallet] = useState(null)

  const [showWallets, setShowWallets] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [showConnectConfirm, setShowConnectConfirm] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)

  const [pendingWallet, setPendingWallet] = useState(null)

  const profileRef = useRef(null)

  useEffect(() => {
    const discovered = new Map()

    const addWallet = (wallet) => {
      if (!wallet?.provider) return

      const provider = wallet.provider
      const info = wallet.info || {}

      let name = info.name || ''

      if (provider.isRabby) {
        name = 'Rabby Wallet'
      } else if (provider.isMetaMask) {
        name = 'MetaMask'
      } else if (provider.isCoinbaseWallet) {
        name = 'Coinbase Wallet'
      } else if (!name) {
        name = 'Injected Wallet'
      }

      let key = ''

      if (provider.isRabby) {
        key = 'rabby'
      } else if (provider.isMetaMask) {
        key = 'metamask'
      } else if (provider.isCoinbaseWallet) {
        key = 'coinbase'
      } else {
        key = info.uuid || name.toLowerCase()
      }

      if (discovered.has(key)) return

      discovered.set(key, {
        info: {
          uuid: key,
          name,
          icon: info.icon || '',
        },
        provider,
      })

      setWallets(Array.from(discovered.values()))
    }

    const handleProvider = (event) => {
      addWallet(event.detail)
    }

    window.addEventListener(
      'eip6963:announceProvider',
      handleProvider
    )

    window.dispatchEvent(
      new Event('eip6963:requestProvider')
    )

    const ethereum = window.ethereum

    if (ethereum?.providers?.length) {
      ethereum.providers.forEach((provider) => {
        addWallet({ provider })
      })
    } else if (ethereum) {
      addWallet({ provider: ethereum })
    }

    const timer = setTimeout(() => {
      window.dispatchEvent(
        new Event('eip6963:requestProvider')
      )
    }, 500)

    return () => {
      clearTimeout(timer)

      window.removeEventListener(
        'eip6963:announceProvider',
        handleProvider
      )
    }
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [])

  useEffect(() => {
    if (!selectedWallet?.provider) return

    const provider = selectedWallet.provider

    const handleAccountsChanged = (accounts) => {
      if (!accounts?.length) {
        setAccount('')
        setSelectedWallet(null)
        setShowProfile(false)
        return
      }

      setAccount(accounts[0])
    }

    provider
      .request({
        method: 'eth_accounts',
      })
      .then(handleAccountsChanged)
      .catch(() => {})

    provider.on?.(
      'accountsChanged',
      handleAccountsChanged
    )

    return () => {
      provider.removeListener?.(
        'accountsChanged',
        handleAccountsChanged
      )
    }
  }, [selectedWallet])

  const selectWallet = (wallet) => {
    setPendingWallet(wallet)
    setShowWallets(false)
    setShowConnectConfirm(true)
  }

  const confirmConnect = async () => {
    if (!pendingWallet?.provider) return

    try {
      const accounts =
        await pendingWallet.provider.request({
          method: 'eth_requestAccounts',
        })

      if (accounts?.length) {
        setAccount(accounts[0])
        setSelectedWallet(pendingWallet)
        setShowConnectConfirm(false)
        setPendingWallet(null)
        setShowProfile(false)
      }
    } catch (error) {
      console.error(
        'Wallet connection failed:',
        error
      )
    }
  }

  const cancelConnect = () => {
    setShowConnectConfirm(false)
    setPendingWallet(null)
  }

  const disconnectWallet = () => {
    setShowProfile(false)
    setShowDisconnectConfirm(true)
  }

  const confirmDisconnect = () => {
    setAccount('')
    setSelectedWallet(null)
    setShowDisconnectConfirm(false)
  }

  const cancelDisconnect = () => {
    setShowDisconnectConfirm(false)
  }

  const connectWallet = () => {
    if (!wallets.length) {
      alert(
        'No EVM wallet detected. Please install MetaMask, Rabby, Coinbase Wallet, or another EVM wallet.'
      )
      return
    }

    setShowProfile(false)
    setShowWallets(true)
  }

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : ''

  return (
    <div
      className="wallet-wrapper"
      ref={profileRef}
    >
      {!account ? (
        <button
          type="button"
          className="wallet-button"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          type="button"
          className="wallet-connected"
          onClick={() =>
            setShowProfile((value) => !value)
          }
        >
          <span className="wallet-connected-dot" />

          Connected

          <span className="wallet-chevron">
            {showProfile ? '⌃' : '⌄'}
          </span>
        </button>
      )}

      {account && showProfile && (
        <div className="wallet-profile">

          <div className="wallet-profile-header">

            <div className="wallet-profile-icon">
              {selectedWallet?.info?.icon ? (
                <img
                  src={selectedWallet.info.icon}
                  alt=""
                />
              ) : (
                'W'
              )}
            </div>

            <div>
              <span>
                CONNECTED WALLET
              </span>

              <strong>
                {selectedWallet?.info?.name ||
                  'EVM Wallet'}
              </strong>
            </div>

          </div>

          <div className="wallet-profile-address">

            <span>
              WALLET ADDRESS
            </span>

            <strong>
              {shortAddress}
            </strong>

            <small>
              {account}
            </small>

          </div>

          <button
            type="button"
            className="wallet-disconnect"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>

        </div>
      )}

      {showWallets && (
        <div
          className="wallet-modal-overlay"
          onClick={() =>
            setShowWallets(false)
          }
        >
          <div
            className="wallet-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="wallet-modal-header">

              <div>
                <span>
                  CONNECT
                </span>

                <h2>
                  Choose your wallet
                </h2>
              </div>

              <button
                type="button"
                className="wallet-close"
                onClick={() =>
                  setShowWallets(false)
                }
              >
                ×
              </button>

            </div>

            <p className="wallet-modal-description">
              Select an installed wallet to
              connect to BaseBounty.
            </p>

            <div className="wallet-list">

              {wallets.map((wallet) => (
                <button
                  type="button"
                  className="wallet-option"
                  key={wallet.info.uuid}
                  onClick={() =>
                    selectWallet(wallet)
                  }
                >

                  <div className="wallet-icon">
                    {wallet.info.icon ? (
                      <img
                        src={wallet.info.icon}
                        alt=""
                      />
                    ) : (
                      'W'
                    )}
                  </div>

                  <div className="wallet-option-text">

                    <strong>
                      {wallet.info.name}
                    </strong>

                    <span>
                      Injected Wallet
                    </span>

                  </div>

                  <span className="wallet-arrow">
                    →
                  </span>

                </button>
              ))}

            </div>

          </div>
        </div>
      )}

      {showConnectConfirm && (
        <div className="wallet-modal-overlay">

          <div className="wallet-confirm-modal">

            <div className="wallet-confirm-icon">
              {pendingWallet?.info?.icon ? (
                <img
                  src={pendingWallet.info.icon}
                  alt=""
                />
              ) : (
                'W'
              )}
            </div>

            <span className="wallet-confirm-label">
              CONNECT WALLET
            </span>

            <h2>
              Connect {pendingWallet?.info?.name}?
            </h2>

            <p>
              BaseBounty wants to connect to your
              wallet and view your wallet address.
            </p>

            <div className="wallet-confirm-actions">

              <button
                type="button"
                className="wallet-confirm-cancel"
                onClick={cancelConnect}
              >
                Cancel
              </button>

              <button
                type="button"
                className="wallet-confirm-connect"
                onClick={confirmConnect}
              >
                Connect
              </button>

            </div>

          </div>

        </div>
      )}

      {showDisconnectConfirm && (
        <div className="wallet-modal-overlay">

          <div className="wallet-confirm-modal">

            <div className="wallet-confirm-icon">
              {selectedWallet?.info?.icon ? (
                <img
                  src={selectedWallet.info.icon}
                  alt=""
                />
              ) : (
                'W'
              )}
            </div>

            <span className="wallet-confirm-label">
              DISCONNECT WALLET
            </span>

            <h2>
              Disconnect wallet?
            </h2>

            <p>
              Your wallet will be disconnected
              from BaseBounty.
            </p>

            <div className="wallet-confirm-actions">

              <button
                type="button"
                className="wallet-confirm-cancel"
                onClick={cancelDisconnect}
              >
                Cancel
              </button>

              <button
                type="button"
                className="wallet-confirm-connect"
                onClick={confirmDisconnect}
              >
                Disconnect
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default WalletButton