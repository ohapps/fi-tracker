import UserProfileForm from '@/components/profile/UserProfileForm';
import { getUserProfile } from '@/server/utils/user/get-user-profile';

export default async function Profile() {
  const userProfile = await getUserProfile();
  return (
    <div className="p-2 md:p-6">
      <UserProfileForm userProfile={userProfile} />
    </div>
  );
}
