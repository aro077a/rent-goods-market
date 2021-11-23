export type MenuListItemProps = {
  name: string;
  index: number;
  menuLoading: string;
  profileType: string;
  onClick: (name: string) => void;
  selected?: string;
};
