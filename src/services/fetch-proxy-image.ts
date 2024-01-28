const fetchProxyImage = async (imageUrl: string) => {
  const response = await fetch(`/api/proxy-image?imageUrl=${encodeURIComponent(imageUrl)}`);
  const data = await response.json();

  if (data.imageUrlBase64) {
    return data.imageUrlBase64;
  }
};

export default fetchProxyImage;
