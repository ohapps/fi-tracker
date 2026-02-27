export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // @ts-expect-error: error object does not have info property
    error.info = await res.json();
    // @ts-expect-error: error object does not have status property
    error.status = res.status;
    throw error;
  }
  return res.json();
};
