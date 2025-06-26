export default function StyledInput(props) {
  return (
    <input
      className="bg-[#222a35] text-white border border-[#94a3b8]/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent outline-none transition"
      {...props}
    />
  );
}
