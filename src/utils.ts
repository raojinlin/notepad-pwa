export const randomID = (len: number): string => {
    let id = '';
    let letters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345789`;
    for (let i = 0; i < len; i++) {
        id += letters.charAt(Math.floor(Math.random() *100) % letters.length);
    }

    return id;
}


export const fetch = (url: string, init: RequestInit): Promise<Response> => {
  return window.fetch(url, init).then(r => {
    if (r.status === 200) {
      return r;
    }

    if (r.status === 401) {
      window.location.href = '/login';
    }

    const err = new Error('Invalid response from server');
    Object.assign(err, {response: r});
    throw err;
  });
}

export const getPostgresURL = () => {
  if (!process.env.POSTGRES_URL) {
    return '';
  }

  const url = new URL(process.env.POSTGRES_URL);
  if (url.hostname.includes('postgres.vercel-storage.com') && !url.searchParams.get('sslmode')) {
    url.searchParams.set('sslmode');
  }

  return url.toString();
}
