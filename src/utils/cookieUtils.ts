export const setCookie = (
  name: string,
  value: string,
  expiresInSeconds = 3600,
  path = "/"
): void => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + expiresInSeconds * 1000);

  const cookieValue =
    encodeURIComponent(value) +
    "; expires=" +
    expirationDate.toUTCString() +
    "; path=" +
    path +
    "; SameSite=Strict";

  document.cookie = name + "=" + cookieValue;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

export const deleteCookie = (name: string, path = "/"): void => {
  document.cookie =
    name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path;
};
