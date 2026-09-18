type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950"
    >
      <p className="text-sm leading-6 sm:text-base">{message}</p>
    </div>
  );
}
