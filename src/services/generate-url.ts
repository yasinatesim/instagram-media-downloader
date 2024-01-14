import request from './request';

export const getGeneratedUrlData = async (url) => {
  const res = await request.post(`/api`, {
    url
  });

  return res
};
