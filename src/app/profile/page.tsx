'use client';

import UserProfileForm from '@/components/profile/UserProfileForm';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { UserProfile } from '@/types/profile';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  userProfile: UserProfile;
}

export default function Profile() {
  const { data, error, isLoading } = useSWR<ProfileData>('/api/profile', fetcher);

  if (error && !data) {
    return (
      <div className="p-2 md:p-6">
        <div className="text-red-500">Failed to load profile. Please try again later.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-2 md:p-6 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!data?.userProfile) return null;

  return (
    <div className="p-2 md:p-6">
      <UserProfileForm userProfile={data.userProfile} />
    </div>
  );
}
