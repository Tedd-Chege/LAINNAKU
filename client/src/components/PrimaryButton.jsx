export default function PrimaryButton({ children, ...props }) {
  return (
    <button
      className="bg-accent text-white rounded-xl shadow-md px-5 py-2 font-medium transition hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
}
