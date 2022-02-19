import DefaultLayout from '../components/DefaultLayout';
import Wallet from '../components/Wallet/Wallet';

export default function ConnectWalletPage() {
  return (
    <>
      <Wallet />
    </>
    );
}

ConnectWalletPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}