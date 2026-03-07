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

export const ADMIN_TRANSLATIONS_BY_KEYS = gql`
  query AdminTranslationsByKeys($keys: [String!]!) {
    adminTranslationsByKeys(keys: $keys) {
      key
      hy
      en
      ru
    }
  }
`;

// About Us (separate from translations)

export const ABOUT_US_ADMIN = gql`
  query AboutUsAdmin {
    aboutUsAdmin {
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

// Hero (admin)

export const HERO_ADMIN = gql`
  query HeroAdmin {
    heroAdmin {
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

// Home section titles + Completed works (admin)

export const HOME_SECTION_ADMIN = gql`
  query HomeSectionAdmin {
    homeSectionAdmin {
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

export const COMPLETED_WORKS_ADMIN = gql`
  query CompletedWorksAdmin {
    completedWorksAdmin {
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

// Contact (admin)

export const CONTACT_ADMIN = gql`
  query ContactAdmin {
    contactAdmin {
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
