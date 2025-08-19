import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    image{
      ${imageQuery}
    },
    body[]{
      ${bodyQuery}
    },
    author->{
      name,
      image {
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
      }
    },
    _createdAt,
    _updatedAt,
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
    }
}`;

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug)] | order(_createdAt desc){
    title,
    slug,
    excerpt,
    image{
      ${imageQuery}
    },
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug)]{slug}`;
