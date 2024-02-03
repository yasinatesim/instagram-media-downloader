export type Cookies = {
  cookies: [
    {
      key: string;
      value: string;
      expires: string;
      maxAge: number;
      domain: string;
      path: string;
      secure: boolean;
      hostOnly: boolean;
      creation: string;
      lastAccessed: string;
    },
  ];
};
