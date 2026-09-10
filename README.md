# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Real L2 mode

This project is wired for Base Sepolia testnet.

1. Copy `.env.example` to `.env`.
2. Set `VITE_BOUNTY_ESCROW_ADDRESS` after deploying `contracts/BountyEscrow.sol` with the Base Sepolia USDC address already configured in `src/config/contractConfig.js`.
3. Run `npm install` and `npm run dev`.
4. Connect an EVM wallet and keep it on Base Sepolia.
5. Create Bounty now performs USDC `approve()` and then `createBounty()` on the escrow contract.

Do not put a private key or seed phrase in the project or `.env`.
Use testnet tokens for development. Mainnet deployment should only happen after independent contract/security review.
