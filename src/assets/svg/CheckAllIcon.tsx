import type { SVGProps } from "react";

const CheckAllIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="m10 16.4l-4-4L4.6 13l5.4 5.4L20.4 8l-1.4-1.4zM3 12.4L1.6 13.8l5.4 5.4L18.4 8l-1.4-1.4L7 16.4z"
    />
  </svg>
);

export default CheckAllIcon;
