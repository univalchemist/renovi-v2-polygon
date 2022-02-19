import { useRouter } from 'next/router';

import DefaultLayout from '../components/DefaultLayout';
import ItemDetails from '../components/ItemDetails/ItemDetails';

export default function BuyItemPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <ItemDetails id={id} />
    </>
    );
}

BuyItemPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}
