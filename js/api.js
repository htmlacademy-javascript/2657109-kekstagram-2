const REMOTE_BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';
const LOCAL_BASE_URL = '/kekstagram';
const BASE_URL = import.meta.env?.DEV ? LOCAL_BASE_URL : REMOTE_BASE_URL;
const DATA_URL = `${BASE_URL}/data`;
const REQUEST_TIMEOUT = 5000;

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error();
  }

  return response;
};

const load = (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  })
    .then(checkResponse)
    .finally(() => {
      clearTimeout(timeoutId);
    });
};

const getData = () => load(DATA_URL).then((response) => response.json());

const sendData = (body) =>
  load(BASE_URL, {
    method: 'POST',
    body,
  });

export { getData, sendData };
