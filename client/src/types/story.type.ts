export type Owner = {
  bio: string;
  email: string;
  id: number;
  image: string;
  username: string;
};

export type Story = {
  body: string;
  createdAt: string;
  description: string;
  favoritesCount: number;
  id: number;
  modifiedAt: string;
  owner: Owner;
  slug: string;
  tagList: string[];
  title: string;
};