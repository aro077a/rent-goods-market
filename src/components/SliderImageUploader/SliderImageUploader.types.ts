import { IProductCreateUploadedFileInfo } from "@/reducers/productCreateReducer";

export type SliderImageUploaderProps = {
  images: IProductCreateUploadedFileInfo[];
  onSelectFile(index: number, file?: File): void;
  onDeleteFile(index: number): void;
};
