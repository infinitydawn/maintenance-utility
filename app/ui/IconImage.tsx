import React from 'react';

type IconImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export default function IconImage({ src, alt, className = '', ...rest }: IconImageProps) {
  return <img src={src} alt={alt} className={`theme-icon ${className}`} {...rest} />;
}
