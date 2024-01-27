const getRandomNumericString = (length: number) => {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getRandomAlphanumericString = (length: number) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateDynamicHeaders = () => {
  // const exampleValues = {
  //   'x-asbd-id': '46548741',
  //   'X-IG-App-ID': '936619743392459',
  //   cookie:
  //     'mid=assda; ig_did=439043958dsfjhdf; datr=sjfkljdlks; ds_user_id=65468412; csrftoken=sdaskdjlksdaj; sessionid=hskjahkjsdah;',
  // };

  const newValues = {
    'x-asbd-id': getRandomNumericString(8),
    'X-IG-App-ID': getRandomNumericString(15),
    cookie: `mid=${getRandomAlphanumericString(8)}; ig_did=${getRandomAlphanumericString(10)}; datr=${getRandomAlphanumericString(10)}; ds_user_id=${getRandomNumericString(8)}; csrftoken=${getRandomAlphanumericString(10)}; sessionid=${getRandomAlphanumericString(12)};`,
  };

  return newValues;
};

export default generateDynamicHeaders;
