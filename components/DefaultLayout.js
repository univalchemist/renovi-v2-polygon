import Head from 'next/head';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Scrollup from '../components/Scrollup/Scrollup';
import FullScreenMask from './FullScreenMask';

export default function DefaultLayout({ children }) {

  const dispatch = useDispatch();
  const stateNotification = useSelector(state => state.notification);

  useEffect(() => {
    if (stateNotification.msg) {

      const options = {
        autoClose: 5000,
        theme: 'colored',
        onOpen: props => {
          dispatch({type: 'CLEAR_NOTIFICATION'})
        }
      }

      if (stateNotification.type === "success") {
        toast.success(stateNotification.msg, options);
      } else {
        toast.error(stateNotification.msg, options);
      }
    }
  }, [stateNotification]);
  return (
    <div className="main">
      <Head>
        {/*jQuery(necessary for all JavaScript plugins)*/}
        {/*<script async src="/js/vendor/jquery-3.5.1.min.js" />*/}
        {/*Bootstrap.js*/}
        {/*<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" />*/}
        {/*Plugins js*/}
        <title>RENOVI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <script src="/js/vendor/all.min.js" />
        <script src="/js/vendor/shuffle.min.js" />
      </Head>
      <Header />
      {children}
      {/* Active js */}
      {/*<Script src="/js/main.js" />*/}
      <Footer />
      <FullScreenMask />
      <ToastContainer toastClassName="toast-dark" />
      <Scrollup />
    </div>
  )
}
