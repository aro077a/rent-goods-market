export interface IDeliveryCard {
  deliveryCard: cardType[];
}

export type cardType = {
  id?: string;
  card?: JSX.Element;
  checked?: boolean;
};
