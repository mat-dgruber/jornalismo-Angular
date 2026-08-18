import { AuthorNamePipe } from './author-name.pipe';
import { Post } from '../services/post.model';

describe('AuthorNamePipe', () => {
  let pipe: AuthorNamePipe;

  beforeEach(() => {
    pipe = new AuthorNamePipe();
  });

  it('deve criar a instância do pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar author_first_name quando disponível', () => {
    const post: Partial<Post> = {
      author_first_name: 'Maria',
      author_last_name: 'Izabela',
      author: 'admin'
    };
    expect(pipe.transform(post as Post)).toBe('Maria');
  });

  it('deve retornar author_last_name quando author_first_name não existir', () => {
    const post: Partial<Post> = {
      author_first_name: '',
      author_last_name: 'Izabela',
      author: 'admin'
    };
    expect(pipe.transform(post as Post)).toBe('Izabela');
  });

  it('deve retornar author (fallback) quando first_name e last_name não existirem', () => {
    const post: Partial<Post> = {
      author_first_name: '',
      author_last_name: '',
      author: 'Redação Editorial'
    };
    expect(pipe.transform(post as Post)).toBe('Redação Editorial');
  });

  it('deve retornar string vazia quando o post for nulo ou indefinido', () => {
    expect(pipe.transform(null as unknown as Post)).toBe('');
    expect(pipe.transform(undefined as unknown as Post)).toBe('');
  });
});
