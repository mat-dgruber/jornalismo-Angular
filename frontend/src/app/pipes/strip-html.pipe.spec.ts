import { StripHtmlPipe } from './strip-html.pipe';

describe('StripHtmlPipe', () => {
  let pipe: StripHtmlPipe;

  beforeEach(() => {
    pipe = new StripHtmlPipe();
  });

  it('deve criar a instância do pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve remover tags HTML simples de uma string', () => {
    const input = '<p>Texto formatado com <strong>negrito</strong> e <em>itálico</em>.</p>';
    const expected = 'Texto formatado com negrito e itálico.';
    expect(pipe.transform(input)).toBe(expected);
  });

  it('deve retornar string vazia quando receber null, undefined ou string vazia', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as unknown as string)).toBe('');
    expect(pipe.transform(undefined as unknown as string)).toBe('');
  });

  it('deve manter texto sem tags HTML inalterado', () => {
    const input = 'Texto jornalístico puramente textual.';
    expect(pipe.transform(input)).toBe(input);
  });
});
