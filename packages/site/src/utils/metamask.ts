import { getSnaps } from './snap';

/**
 * Tries to detect if one of the injected providers is MetaMask and checks if snaps is available in that MetaMask version.
 *
 * @returns True if the MetaMask version supports Snaps, false otherwise.
 */
export const detectSnaps = async () => {
  if (window.ethereum?.detected) {
    for (const provider of window.ethereum.detected) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        // enforces MetaMask as provider
        if (window.ethereum.setProvider) {
          window.ethereum.setProvider(provider);
        }

        return true;
      } catch {
        // no-op
      }
    }
  }

  if (window.ethereum?.providers) {
    for (const provider of window.ethereum.providers) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        window.ethereum = provider;

        return true;
      } catch {
        // no-op
      }
    }
  }

  try {
    await getSnaps();

    return true;
  } catch {
    return false;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is MetaMask Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

export const connectAccount = async () => {
  const account = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  const chainId = await window.ethereum.request({
    method: 'eth_chainId'
  })

  if (Number(chainId) !== 56) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x38',
          chainName: 'Binance Smart Chain Mainnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'bnb',
            decimals: 18,
          },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com/'],
        },
      ],
    });

    // Switch to Binance Smart Chain Mainnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }],
    });
  }
  return account;
};
