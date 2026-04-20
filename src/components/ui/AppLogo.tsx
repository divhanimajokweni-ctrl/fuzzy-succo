interface AppLogoProps {
  size?: number;
}

export default function AppLogo({ size = 28 }: AppLogoProps) {
  return (
    <div
      className="rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
        style={{ width: size * 0.57, height: size * 0.57 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
  );
}
