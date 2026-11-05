import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  viewBox: '0 0 24 24',
} as const;

function ShieldLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 32 36" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 2 3 6.5v10.2C3 25.3 8.6 31.6 16 34c7.4-2.4 13-8.7 13-17.3V6.5L16 2Z"
        fill="#2185d0"
      />
      <path d="M16 2v32c7.4-2.4 13-8.7 13-17.3V6.5L16 2Z" fill="#1678c2" />
      <path
        d="m10.5 17.5 3.8 3.8 7.4-7.6"
        stroke="#fff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const UserIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const HomeIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
  </svg>
);
const ShieldIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" />
  </svg>
);
const PawIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <circle cx="5" cy="10" r="2" />
    <circle cx="9" cy="5.5" r="2" />
    <circle cx="15" cy="5.5" r="2" />
    <circle cx="19" cy="10" r="2" />
    <path d="M8 17c0-3 2-5.5 4-5.5s4 2.5 4 5.5a2.5 2.5 0 0 1-4 2 2.5 2.5 0 0 1-4-2Z" />
  </svg>
);
const HistoryIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5M12 7v5l3 2" />
  </svg>
);
const ClipboardIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1M9 11h6M9 15h4" />
  </svg>
);
const CheckIcon = (p: IconProps) => (
  <svg {...stroke} strokeWidth={2.6} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
const ArrowIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
const BackIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <path d="M19 12H5m6 6-6-6 6-6" />
  </svg>
);
const AlertIcon = (p: IconProps) => (
  <svg {...stroke} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5m0 3.5h.01" />
  </svg>
);

function CalendarIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export {
  ShieldLogo,
  CalendarIcon,
  UserIcon,
  HomeIcon,
  ShieldIcon,
  PawIcon,
  HistoryIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowIcon,
  BackIcon,
  AlertIcon,
};
