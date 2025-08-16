import React from 'react';

interface OnboardingFrameProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

export const OnboardingFrame: React.FC<OnboardingFrameProps> = ({ 
  children, 
  backgroundImage = "/images/bg.jpg" 
}) => {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl rounded-3xl overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 opacity-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};