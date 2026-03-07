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

// About Us (separate from translations)

export const UPDATE_ABOUT_US = gql`
  mutation UpdateAboutUs($input: UpdateAboutUsInput!) {
    updateAboutUs(input: $input) {
      id
      title {
        hy
        en
        ru
      }
      historyTitle {
        hy
        en
        ru
      }
      historyText {
        hy
        en
        ru
      }
      whyUsTitle {
        hy
        en
        ru
      }
      whyUsText {
        hy
        en
        ru
      }
      privacyTitle {
        hy
        en
        ru
      }
      privacyText {
        hy
        en
        ru
      }
    }
  }
`;

// Hero

export const UPDATE_HERO = gql`
  mutation UpdateHero($input: UpdateHeroInput!) {
    updateHero(input: $input) {
      id
      title {
        hy
        en
        ru
      }
      subtitle {
        hy
        en
        ru
      }
      ctaText {
        hy
        en
        ru
      }
      ctaLink
      image
      card1Title {
        hy
        en
        ru
      }
      card1Subtitle {
        hy
        en
        ru
      }
      card1Image
      card2Title {
        hy
        en
        ru
      }
      card2Subtitle {
        hy
        en
        ru
      }
      card2Image
    }
  }
`;

// Home section titles

export const UPDATE_HOME_SECTION = gql`
  mutation UpdateHomeSection($input: UpdateHomeSectionInput!) {
    updateHomeSection(input: $input) {
      id
      ourWorksTitle {
        hy
        en
        ru
      }
      completedWorksTitle {
        hy
        en
        ru
      }
      selectedOnMapLabel {
        hy
        en
        ru
      }
      newProjectCta {
        hy
        en
        ru
      }
      completedWorksMapTitle {
        hy
        en
        ru
      }
    }
  }
`;

// Completed works

export const CREATE_COMPLETED_WORK = gql`
  mutation CreateCompletedWork($input: CreateCompletedWorkInput!) {
    createCompletedWork(input: $input) {
      id
      name {
        hy
        en
        ru
      }
      address {
        hy
        en
        ru
      }
      mapUrl
      order
      lat
      lng
      image
    }
  }
`;

export const UPDATE_COMPLETED_WORK = gql`
  mutation UpdateCompletedWork($id: String!, $input: UpdateCompletedWorkInput!) {
    updateCompletedWork(id: $id, input: $input) {
      id
      name {
        hy
        en
        ru
      }
      address {
        hy
        en
        ru
      }
      mapUrl
      order
      lat
      lng
      image
    }
  }
`;

export const REMOVE_COMPLETED_WORK = gql`
  mutation RemoveCompletedWork($id: String!) {
    removeCompletedWork(id: $id)
  }
`;

// Contact

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      title {
        hy
        en
        ru
      }
      mapTitle {
        hy
        en
        ru
      }
      ctaHeading {
        hy
        en
        ru
      }
      address {
        hy
        en
        ru
      }
      description {
        hy
        en
        ru
      }
      email
      phone
      mapEmbedUrl
    }
  }
`;
