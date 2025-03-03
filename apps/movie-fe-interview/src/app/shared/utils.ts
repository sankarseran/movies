export const compareArr = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
};

export const onImageError = (event: Event, height?: number) => {
  const imgElement = event.target as HTMLImageElement;
  if (height) imgElement.height = height;
  imgElement.src = 'assets/images/logo-icon.svg';
};
