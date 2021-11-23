export type StoreInfoSheetProps = {
  opened?: boolean;
  productUid?: string;
  type?: string;
  onClose?(): void;
  onStartChat?(message: string): void;
};
