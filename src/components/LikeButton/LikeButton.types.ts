export type LikeButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "ref"
> & {
  active?: boolean;
  bordered?: boolean;
  shadow?: boolean;
};
