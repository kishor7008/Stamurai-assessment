import React from 'react';

type TypographyProps = {
  children: React.ReactNode;
  variant?: 'small' | 'medium' | 'large';
  color?: 'blue-gray' | 'red' | 'green';
  className?: string;
};

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'medium',
  color = 'blue-gray',
  className = '',
}) => {
  // Define custom styles based on props
  const getFontSize = () => {
    switch (variant) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'red':
        return 'text-red-500';
      case 'green':
        return 'text-green-500';
      default:
        return 'text-blue-gray-500';
    }
  };

  const combinedClasses = `${getFontSize()} ${getColor()} ${className}`;

  return (
    <p className={combinedClasses}>
      {children}
    </p>
  );
};

export default Typography;
