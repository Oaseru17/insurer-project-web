import Link from 'next/link';

const PROFILES = [
  { id: 'a', label: 'Sample profile A' },
  { id: 'b', label: 'Sample profile B' },
] as const;

type ProfileId = (typeof PROFILES)[number]['id'];

function toProfileId(value: unknown): ProfileId {
  return value === 'b' ? 'b' : 'a';
}

interface ProfileSwitcherProps {
  product: string;
  active: ProfileId;
  ff: string | undefined;
}

// Demo control: the brief's two sample customers stand in for a signed-in customer.
function ProfileSwitcher({ product, active, ff }: ProfileSwitcherProps) {
  return (
    <nav aria-label="Sample customer" className="flex flex-wrap gap-2 text-sm">
      {PROFILES.map((profile) => {
        const query = new URLSearchParams({ profile: profile.id, ...(ff ? { ff } : {}) });
        const isActive = profile.id === active;
        return (
          <Link
            key={profile.id}
            href={`/quote/${product}?${query}`}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full border px-3 py-1.5 ${
              isActive
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-blue-500'
            }`}
          >
            {profile.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { type ProfileId, ProfileSwitcher, toProfileId };
