import md5 from 'md5';

const Encrypt = (text: string) => {
  return md5(md5(md5(md5(md5(text)))));
};

export default Encrypt;
