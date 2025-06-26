export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 border border-white/10 shadow-cosmic rounded-2xl p-6 transition duration-200 hover:shadow-lg hover:scale-[1.02] focus-within:shadow-xl focus-within:scale-[1.01] ${className}`}
      tabIndex={0} // for keyboard focus accessibility
      aria-label="Glass card container"
    >
      {children}
    </div>
  );
}
