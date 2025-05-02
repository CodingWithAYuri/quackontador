import React from "react";
import { IMAGE_PATHS } from "../constants/paths";

const Avatar = ({ src = IMAGE_PATHS.avatar, size = 40, alt = "User Avatar" }) => (
  <img 
    src={src} 
    className="rounded-circle" 
    height={size} 
    width={size} 
    alt={alt} 
    loading="lazy" 
  />
);

export default Avatar;