interface ProductDimensions {
  width: number | null;
  height: number | null;
  length: number | null;
}

interface ProductSpecifications {
  material: string | null;
  weight: number | null;
  dimensions: ProductDimensions | null;
  ageRange: string | null;
  color: string | null;
}

interface LoginResponse {
  login: {
    token: string;
    role: string;
  };
}

interface Product {
  id: string;
  title: { hy: string; en: string; ru: string };
  description: { hy: string; en: string; ru: string } | null;
  slug: string;
  price: number;
  discount: number | null;
  currency: string;
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    title: { hy: string; en: string; ru: string };
    slug: string | null;
    description: { hy: string; en: string; ru: string } | null;
    icon: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  images: string[];
  specifications: ProductSpecifications | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: ID!;
  title: { hy: string; en: string; ru: string };
  slug: string | null;
  image: string | null;
  icon: string | null;
  products: Product[];
  description: { hy: string; en: string; ru: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesQueryResponse {
  categories: Category[];
}

interface CreateCategoryMutationResponse {
  createCategory: Category;
}
