import React from "react";

export default ({ fill }: { fill?: string }) => (
  <svg
    width="18"
    height="22"
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={fill || "var(--f7-text-color)"}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.05815 4.09552C5.37273 2.75107 7.15083 2 9 2C10.8492 2 12.6273 2.75107 13.9418 4.09552C15.2572 5.44073 16 7.26992 16 9.18182C16 11.9701 14.2249 14.6834 12.2664 16.7977C11.3062 17.8342 10.3428 18.683 9.61852 19.2729C9.38353 19.4643 9.17453 19.6277 9 19.7608C8.82547 19.6277 8.61647 19.4643 8.38148 19.2729C7.65716 18.683 6.69377 17.8342 5.73362 16.7977C3.77507 14.6834 2 11.9701 2 9.18182C2 7.26992 2.74283 5.44073 4.05815 4.09552ZM8.43613 21.8259C8.43641 21.8261 8.43666 21.8262 9 21L9.56334 21.8262C9.22351 22.0579 8.77596 22.0576 8.43613 21.8259ZM8.43613 21.8259L9 21C9.56334 21.8262 9.5643 21.8256 9.56458 21.8254L9.56656 21.824L9.57268 21.8198L9.59346 21.8055C9.61104 21.7932 9.636 21.7758 9.66786 21.7532C9.73157 21.7081 9.82289 21.6425 9.93788 21.5576C10.1678 21.3878 10.4929 21.1402 10.8815 20.8237C11.6572 20.192 12.6938 19.2794 13.7336 18.1568C15.7751 15.953 18 12.7572 18 9.18182C18 6.75381 17.0571 4.42084 15.3719 2.69728C13.6859 0.972956 11.3943 0 9 0C6.60571 0 4.31415 0.972956 2.62814 2.69728C0.942878 4.42084 0 6.75381 0 9.18182C0 12.7572 2.22493 15.953 4.26638 18.1568C5.30623 19.2794 6.34284 20.192 7.11852 20.8237C7.50713 21.1402 7.83222 21.3878 8.06212 21.5576C8.17711 21.6425 8.26843 21.7081 8.33214 21.7532C8.364 21.7758 8.38896 21.7932 8.40654 21.8055L8.42732 21.8198L8.43344 21.824L8.43613 21.8259ZM7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9ZM9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5Z"
    />
  </svg>
);
