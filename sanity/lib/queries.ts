import { groq } from "next-sanity";

// Get all posts
export const postsQuery = groq`*[_type == "post"] {
  _createdAt,
  title,
  slug,
  mainImage,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{ 
    title, description, mainImage, body
  }`;

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }`;

// Get all posts categorized
export const categorizedPostsQuery = groq`{
  "categories": *[_type == "category"] {
    "name": title,
    "slug": slug.current,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc)[0...4] {
      _createdAt,
      title,
      slug,
      mainImage,
      "imageURL": mainImage.asset->url,
      "authorName": author->name,
      publishedAt
    }
  }
}`;

// Search posts query
export const searchPostsQuery = groq`*[_type == "post" && (title match $searchTerm || body match $searchTerm)] {
  _id,
  title,
  slug,
  _createdAt
} | order(_createdAt desc)`;

// Get the latest posts
export const latestPostsQuery = groq`
  *[_type == "post" && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...10] {
    _id,
    title,
    slug,
    publishedAt
  }
`;