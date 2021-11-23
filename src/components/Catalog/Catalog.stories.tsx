import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { Product, ProductRentOptions } from "@/types/marketplaceapi";
import F7Wrapper from "@/F7Wrapper";

import Catalog from "./Catalog";
import { CatalogProps } from "./Catalog.types";

export default {
  title: "Components/Catalog",
  component: Catalog,
  decorators: [
    (Story) => (
      <F7Wrapper>
        <Story />
      </F7Wrapper>
    ),
  ],
} as Meta;

const mock: CatalogProps = {
  items: Array.from({ length: 10 }, () => ({
    uid: "820a8a84-df09-4e17-8d77-fa5f1d395116",
    type: "P",
    seller: { name: "Seller" },
    name: "Flowers",
    shortDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque eligendi repudiandae, debitis blanditiis rerum minus impedit rem atque sit reprehenderit!",
    category: "012001",
    categoryName: "Other",
    price: 16,
    discountedPrice: 13.55,
    currencyCode: "USD",
    inStock: true,
    quantity: 50,
    imageUrl1:
      "https://www.googleapis.com/download/storage/v1/b/productpicture_teta/o/PDP_100-000-159-31_76240d0a-d71f-46ce-b78a-c102c0478eaa?generation=1633442008238407&alt=media",
    imageThumbnailUrl1:
      "https://www.googleapis.com/download/storage/v1/b/productpicture_teta/o/PDP_100-000-159-31_c442857a-3ce5-41ab-8b61-907ac4c0b5c0?generation=1633442009727408&alt=media",
    address: { city: "Rīga", countryCode: "LV" },
    coordinates: "56.93377170202712,24.20792532898228",
    productDate: new Date("2021-10-05T13:53:26.48497"),
    purchasable: true,
    dealType: Product.DealTypeEnum.SELL,
    wish: false,
    images: [
      "https://www.googleapis.com/download/storage/v1/b/productpicture_teta/o/PDP_100-000-159-31_76240d0a-d71f-46ce-b78a-c102c0478eaa?generation=1633442008238407&alt=media",
    ],
    languageCode: "ru",
    status: Product.StatusEnum.AFR,
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni deserunt expedita quos illum! Nulla consectetur illum, voluptatum, quae aperiam delectus totam ab deleniti, doloremque est voluptates laboriosam. Doloremque, vitae. Pariatur, veritatis. Molestias, natus. Tempore suscipit rem voluptates autem odio! Nulla, corporis quisquam. Nisi nihil libero fugiat quisquam expedita obcaecati quibusdam aut adipisci maxime eveniet nesciunt quae quos sed, quidem accusamus voluptate a non reprehenderit nemo harum. Dignissimos consequuntur vel illum perspiciatis! Vel dolorum dolor voluptates, facere voluptas molestiae nemo quod ab, accusamus id ratione sint dolore illo quibusdam commodi perspiciatis saepe alias atque nihil corporis repudiandae reiciendis. Perspiciatis, iusto esse.",
    rentOptions: {
      period: ProductRentOptions.PeriodEnum.MONTH,
      deposit: 100,
    },
    viewCount: 16,
    wishCount: 32,
  })),
  addToWish: () => undefined,
  showFeaturesHiglight: true,
  showStatus: false,
  showAnalytics: false,
};

export const Default: Story<CatalogProps> = (args) => <Catalog {...args} />;
Default.args = { ...mock };

export const WithInfo: Story<CatalogProps> = (args) => <Catalog {...args} />;
WithInfo.args = { ...mock, showAnalytics: true, showStatus: true, showFeaturesHiglight: true };
