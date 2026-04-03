const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';
const DATA_URL = `${BASE_URL}/data`;
const POST_URL = `${BASE_URL}/`;

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error();
  }

  return response;
};

const load = (url, options = {}) => fetch(url, options).then(checkResponse);

const getData = () => load(DATA_URL).then((response) => response.json());

const sendData = (body) =>
  load(POST_URL, {
    method: 'POST',
    body,
  });

export { getData, sendData };
