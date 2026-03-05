import { gql } from "@apollo/client";

// Categories

export const GET_CATEGORIES = gql`
  query categories {
    categories {
      id
      title {
        hy
        en
        ru
      }
      slug
      description {
        hy
        en
        ru
      }
      icon
      image
      createdAt
      updatedAt
      products {
        id
      }
    }
  }
`;

// Products

export const PRODUCTS = gql`
  query Products {
    products {
      id
      title {
        hy
        en
        ru
      }
      description {
        hy
        en
        ru
      }
      slug
      price
      discount
      currency
      stock
      isFeatured
      isPublished
      createdAt
      updatedAt
      category {
        id
        title {
          hy
          en
          ru
        }
        slug
        description {
          hy
          en
          ru
        }
        icon
        image
        createdAt
        updatedAt
      }
      images
      specifications {
        material
        weight
        dimensions {
          width
          height
          length
        }
        ageRange
        color
      }
      createdAt
      updatedAt
    }
  }
`;

export const PRODUCT = gql`
  query product($id: ID!) {
    product(id: $id) {
      id
      title {
        hy
        en
        ru
      }
      description {
        hy
        en
        ru
      }
      slug
      price
      discount
      currency
      stock
      isFeatured
      isPublished
      images
      specifications {
        material
        weight
        dimensions {
          width
          height
          length
        }
        ageRange
        color
      }
      category {
        id
        title {
          hy
          en
          ru
        }
        slug
        description {
          hy
          en
          ru
        }
        icon
        image
        createdAt
        updatedAt
      }
    }
    categories {
      id
      title
      slug
      description
      icon
      image
      createdAt
      updatedAt
    }
  }
`;

// Users

export const FIND_ALL_USERS = gql`
  query Users {
    users {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
  }
`;

// Translations (admin)

export const ADMIN_TRANSLATIONS = gql`
  query AdminTranslations {
    adminTranslations {
      key
      hy
      en
      ru
    }
  }
`;
