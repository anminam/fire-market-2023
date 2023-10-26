export function cls(...classnames: string[]): string {
  return classnames.join(' ');
}

export function moneyFormat(price: number): string {
  if (!price) {
    return '';
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function dateFormat(date: Date | string): string {
  return new Date(date).toLocaleDateString('ko-KR');
}

export function chatDateFormat(date: Date | string): string {
  const targetDate = new Date(date);
  const now = new Date();

  // 오늘인 경우
  if (isSameDay(now, targetDate)) {
    let hours = targetDate.getHours();
    const minutes = targetDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours < 12 ? '오전' : '오후';
    hours = hours % 12 || 12; // 0 시간을 12로 바꿈
    return `${ampm} ${hours}:${minutes}`;
  }

  // 오늘이 아닌 경우
  const daysAgo = calculateDaysAgo(now, targetDate);
  if (daysAgo === 1) {
    return '어제';
  } else {
    return `${daysAgo}일 전`;
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function calculateDaysAgo(currentDate: Date, pastDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초
  const diffDays = Math.round(
    Math.abs((currentDate.getTime() - pastDate.getTime()) / oneDay)
  );
  return diffDays;
}

export function getImageSrc(src: string, isAvatar?: boolean): string {
  const avatarPath = isAvatar ? '/avatar' : '';
  return `https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${src}${avatarPath}`;
}
