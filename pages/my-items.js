import DefaultLayout from '../components/DefaultLayout';
import ProfileView from '../components/Profile/ProfileView';
import ExploreMyItems from '../components/Explore/ExploreMyItems';

export default function MyItemsPage() {
  return (
    <>
      <ProfileView />
      <ExploreMyItems />
    </>
    );
}

MyItemsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )
}
