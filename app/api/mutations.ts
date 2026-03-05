import { gql } from "@apollo/client";

// Auth

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      id
      email
      name
      role
      token
    }
  }
`;

// Categories

export const CREATE_CATEGORY = gql`
  mutation createCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      title {
        hy
        en
        ru
      }
      slug
      icon
      image
      description {
        hy
        en
        ru
      }
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id)
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CreateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      title {
        hy
        en
        ru
      }
      slug
      icon
      image
      description {
        hy
        en
        ru
      }
      createdAt
      updatedAt
    }
  }
`;

// Products

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`;

export const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id)
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: CreateProductInput!) {
    updateProduct(id: $id, input: $input) {
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
  }
`;

// Translations (admin)

export const UPSERT_TRANSLATION = gql`
  mutation UpsertTranslation($input: TranslationInput!) {
    upsertTranslation(input: $input) {
      key
      hy
      en
      ru
    }
  }
`;

export const DELETE_TRANSLATION = gql`
  mutation DeleteTranslation($key: String!) {
    deleteTranslation(key: $key)
  }
`;
