export interface ICategories {
  categoriesData: categoryType[];
}

export type categoryType = {
  id: number;
  category: string;
  subCategories?: any;
};

export const categoriesData = [
  {
    id: 1,
    category: "Hobby & Entertainment",
    subCategories: [
      {
        id: "a1",
        subCategory: "Crafts",
      },
      {
        id: "a2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 2,
    category: "Vehicle",
    subCategories: [
      {
        id: "b1",
        subCategory: "Crafts",
      },
      {
        id: "b2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 3,
    category: "Property",
    subCategories: [
      {
        id: "c1",
        subCategory: "Crafts",
      },
      {
        id: "c2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 4,
    category: "Business",
    subCategories: [
      {
        id: "d1",
        subCategory: "Crafts",
      },
      {
        id: "d2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 5,
    category: "Fashion",
    subCategories: [
      {
        id: "e1",
        subCategory: "Crafts",
      },
      {
        id: "e2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 6,
    category: "For Children",
    subCategories: [
      {
        id: "f1",
        subCategory: "Crafts",
      },
      {
        id: "f2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 7,
    category: "Garden & Home",
    subCategories: [
      {
        id: "g1",
        subCategory: "Crafts",
      },
      {
        id: "g2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 8,
    category: "Job",
    subCategories: [
      {
        id: "h1",
        subCategory: "Crafts",
      },
      {
        id: "h2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 9,
    category: "Pets",
    subCategories: [
      {
        id: "j1",
        subCategory: "Crafts",
      },
      {
        id: "j2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 10,
    category: "Sport",
    subCategories: [
      {
        id: "l1",
        subCategory: "Crafts",
      },
      {
        id: "l2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 11,
    category: "Electronics",
    subCategories: [
      {
        id: "u1",
        subCategory: "Crafts",
      },
      {
        id: "u2",
        subCategory: "Gift Card",
      },
    ],
  },
  {
    id: 12,
    category: "Others",
    subCategories: [
      {
        id: "r1",
        subCategory: "Crafts",
      },
      {
        id: "r2",
        subCategory: "Gift Card",
      },
    ],
  },
];
