import { Header } from '~/components/app-header';

import { AccountSections } from './_components/account-sections';

export default function Account() {
  return (
    <div className="h-full w-full overflow-hidden overflow-y-auto rounded-lg bg-neutral-900">
      <Header className="from-bg-neutral-900">
        <h1 className="mb-2 text-3xl font-semibold text-white">Account</h1>
      </Header>
      <AccountSections />
    </div>
  );
}
