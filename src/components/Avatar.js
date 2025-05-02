import React from "react";
import { IMAGE_PATHS } from "../constants/paths";
import PropTypes from 'prop-types';

const Avatar = ({ src, size, alt, className }) => {
  const imageSource = src || IMAGE_PATHS.avatar;
  
  return (
    <img 
      src={imageSource}
      className={`rounded-circle ${className || ''}`}
      height={size}
      width={size}
      alt={alt}
      loading="lazy"
      style={{ objectFit: 'cover' }}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  size: PropTypes.number,
  alt: PropTypes.string,
  className: PropTypes.string
};

Avatar.defaultProps = {
  size: 40,
  alt: "User Avatar",
  className: ""
};

export default Avatar;