import { useEffect } from 'react';

import { FocusAwareStatusBar, SafeAreaView } from '@/components/ui';
import { useAuth } from '@/lib';
import { useGetMeQuery } from '@/lib/hooks/queries/user.query';

import InfoSection from './_components/info-section';
import UtilSection from './_components/util-section';

export default function ProfileScreen() {
  const { data, isLoading } = useGetMeQuery();
  const setUserInfor = useAuth((state) => state.setUserInfor);

  useEffect(() => {
    if (data?.data) {
      setUserInfor(data.data);
    }
  }, [data, setUserInfor]);

  return (
    <SafeAreaView className="flex min-h-screen w-full flex-col items-center bg-white px-6">
      <FocusAwareStatusBar />
      <InfoSection isLoading={isLoading} user={data?.data} />
      <UtilSection />
    </SafeAreaView>
  );
}
