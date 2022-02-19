import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { useStore } from '../store';

import AOS from 'aos';

import '../globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration : 1000,
      offset: 10
    })
  });
  const store = useStore(pageProps.initialReduxState)

  const getLayout = Component.getLayout || ((page) => page)

  const getLibrary = (provider) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        {getLayout(<Component {...pageProps} />)}
      </Web3ReactProvider>
    </Provider>
  );
}
