 export const trimLength = (str:string) => {
    const maxLength = 30;
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength) + "...";
  };