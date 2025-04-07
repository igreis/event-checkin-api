export function generateSlug(text: string): string {
    return text
      .normalize('NFD') //tira o acento -> é -> e'
      .replace(/[\u0300-\u036f]/g, '') //substituir os acentos por string vazia
      .toLowerCase() //caixa baixa
      .replace(/[^\w\s-]/g, '') //substitui caracteres que nao sejam alfa-numericos por string vazia
      .replace(/\s+/g, '-')//substitui espaço em branco por hifen
  } //funçao para criar um slug