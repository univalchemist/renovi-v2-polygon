import DefaultLayout from '../components/DefaultLayout';

import CreateCollectible from '../components/CreateCollectible/CreateCollectible';

export default function CreateCollectiblePage() {
  return (
    <>
      <CreateCollectible />
    </>
    );
}

CreateCollectiblePage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}
