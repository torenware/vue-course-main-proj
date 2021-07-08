export default async function fetcher<T>(
  res: string,
  method: string,
  token: string | false = false,
  body = {}
): Promise<T> {
  const base = '/';
  const url = `${base}${res}`;
  let payload: string | boolean = false;
  if (method.toUpperCase() === 'POST') {
    payload = JSON.stringify(body);
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    // @ts-ignore
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (payload) {
    options.body = payload;
  }
  const rslt = await fetch(url, options);
  return rslt.json().then(data => data);
}
