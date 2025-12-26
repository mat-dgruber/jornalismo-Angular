import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../services/post.model';

@Pipe({
  name: 'authorName',
  standalone: true
})
export class AuthorNamePipe implements PipeTransform {

  transform(post: Post): string {
    if (!post) return '';

    if (post.author_first_name) {
      return post.author_first_name;
    } else if (post.author_last_name) {
      return post.author_last_name;
    } else {
      return post.author;
    }
  }

}
