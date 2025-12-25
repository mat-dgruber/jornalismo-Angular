export interface Post {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  author_first_name: string;
  category: string;
  image: string;
  published_date: Date;
  slug: string;
}