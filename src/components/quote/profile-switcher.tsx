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
    <nav
      aria-label="Sample customer"
      className="inline-flex overflow-hidden rounded-ui border border-line bg-white text-sm"
    >
      {PROFILES.map((profile) => {
        const query = new URLSearchParams({ profile: profile.id, ...(ff ? { ff } : {}) });
        const isActive = profile.id === active;
        return (
          <Link
            key={profile.id}
            href={`/quote/${product}?${query}`}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-[8px] px-4 py-2 font-bold transition-colors ${
              isActive ? 'bg-primary text-white' : 'text-ink-muted hover:bg-canvas hover:text-ink'
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
