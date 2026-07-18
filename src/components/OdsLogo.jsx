import React from 'react';

/**
 * Component hiển thị Logo ODS (Load trực tiếp từ file ảnh thay vì vẽ SVG)
 */
export const OdsLogo = ({ className = "w-6 h-6", isDark = false }) => (
  <img 
    src={isDark ? "/assets/logo-ods-vertical-white.png" : "/assets/logo-ods-vertical-black.png"} 
    alt="ODS Brand Logo" 
    className={`${className} object-contain`}
  />
);

export default OdsLogo;
