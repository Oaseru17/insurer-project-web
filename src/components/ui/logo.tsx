import Image from 'next/image';

// Olli wordmark (black with magenta dot), from olli.insure brand assets.
function OlliLogo({
  className,
  variant = 'dark',
}: {
  className?: string;
  variant?: 'dark' | 'light';
}) {
  return (
    <Image
      src={variant === 'dark' ? '/brand/olli-logo.png' : '/brand/olli-logo-white.png'}
      alt="Olli"
      width={1305}
      height={653}
      priority
      className={className}
    />
  );
}

export { OlliLogo };
