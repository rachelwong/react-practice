import type { PropsWithChildren, ReactNode } from "react";

interface ScreenLayoutProps {
  title?: string;
  brief?: string;
  description?: ReactNode;
}

const ScreenLayout = ({
  title,
  brief,
  description,
  children,
}: PropsWithChildren<ScreenLayoutProps>) => {
  return (
    <>
      {title && (
        <div className="heading my-6 flex flex-col items-start justify-start gap-y-2">
          <h3 className="text-neutral-800 font-extrabold text-xl">{title}</h3>
          {brief && (
            <p className="flex flex-row">
              <a href={brief} target="_blank" rel="noreferrer" className="link">
                Original brief here
              </a>
            </p>
          )}
          <div className="heading__description">{description}</div>
        </div>
      )}
      {children}
    </>
  );
};

export default ScreenLayout;
