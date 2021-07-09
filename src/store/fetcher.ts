import FetchError from '@/utils/FetchError';

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
  if (![200, 201].includes(rslt.status)) {
    console.log('orig status', rslt.statusText);
    const errInfo = await rslt.json();
    const statusText = errInfo.error || rslt.statusText;
    console.log(`Fetch: ${rslt.status} ${statusText}`);
    throw new FetchError(statusText, rslt.status);
  }
  return rslt.json().then(data => data);
}
