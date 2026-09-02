import type { CSSProperties, ReactNode } from "react";
export const Loading = () => <p role="status">Loading…</p>;
export const Skeleton = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    role="status"
    aria-label="Loading"
    className={["skeleton", className].filter(Boolean).join(" ")}
    style={style}
  />
);
export const ErrorState = ({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) => (
  <section role="alert">
    <p>{message}</p>
    {retry && <button onClick={retry}>Try again</button>}
  </section>
);
export const EmptyState = ({ children }: { children: ReactNode }) => (
  <p>{children}</p>
);
