export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function moneyFormat(price: number): string {
  if (!price) {
    return '';
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
