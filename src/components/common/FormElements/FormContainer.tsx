import { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="bg-white border border-none rounded-lg p-6 transition-all duration-300 ">
        {children}
      </div>
    </div>
  );
}
