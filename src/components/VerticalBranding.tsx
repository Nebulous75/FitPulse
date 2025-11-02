export default function VerticalBranding() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-30 hidden lg:block">
      <p
        className="text-[8rem] font-black text-gray-800 whitespace-nowrap"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        FitPulse
      </p>
    </div>
  );
}
