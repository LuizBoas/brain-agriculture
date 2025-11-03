import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: String;
  noPadding?: Boolean;
}

export const defaultPadding = `xl:px-0 lg:px-6 md:px-6 px-8 max-w-6xl m-auto`;

export function Container({ children, className, noPadding }: ContainerProps) {
  return (
    <div className={`${!noPadding && defaultPadding} ${className}`}>
      {children}
    </div>
  );
}
