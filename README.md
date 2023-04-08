

<h3 align="center">
  <br />
   <a  href="https://github.com/yasinatesim/instagram-fullsize-picture"><img  src="https://yasinates.com/instagram-fullsize-picture.png"  alt="Instagram Profile Picture"  width="200" /></a>
  <br />
Instagram Full Size Picture
  <br />
</h3>
<hr />

<p  align="center">This project is a full size Instagram photo display tool. 😎</p>


  <p align="center">
· <a  href="https://instagram-fullsize-picture.yasinatesim.vercel.app/">View Demo</a>
  </p>


## 📖 About



This project is a full size Instagram photo display tool.

### 💡Idea
Instagram profile picture enlargers on the internet are not working due to Instagram's new API update. I found a working API and made the web simple interface 😉


### 📚Tech Stack

<table>
  <tr>
    <td> <a href="https://github.com/dilame/instagram-private-api">dilame/instagram-private-api</a></td>
    <td>NodeJS Instagram private API SDK. Written in TypeScript.</td>
  </tr>
  <tr>
    <td><a href="https://nextjs.org/">Next.js</a></td>
    <td>The React Framework for SEO Friendly website and more...</td>
  </tr>
  <tr>
    <td> <a href="https://github.com/conventional-changelog/commitlint">Commitlint</a></td>
    <td>Send commit messages to <a href="https://www.conventionalcommits.org/en/v1.0.0/">conventional commits</a> rules</td>
  </tr>
  <tr>
    <td><a href="https://sass-lang.com/">SASS</a></td>
    <td>The most mature, stable, and powerful professional grade CSS extension language in the world</td>
  </tr>
  <tr>
    <td><a href="https://editorconfig.org/">Editorconfig</a></td>
    <td>Helps maintain consistent coding styles for my working on the same project across various editors and IDEs</td>
  </tr>
  <tr>
    <td><a href="https://eslint.org/">Eslint</a></td>
    <td>Find and fix problems in your JavaScript code</td>
  </tr>
  <tr>
    <td><a href="https://prettier.io/">Prettier</a></td>
    <td>An opinionated code formatter</td>
  </tr>
</table>



## 🧐 What's inside?



### API's
```bash
/api/[INSTAGRAM-USERNAME]
```


Get Instagram full-resolution profile picture with url slug.



**For Example**

```
/api/yasinatesim
```



### Pages


- **Home**

It is the page that brings the full-resolution profile picture of Instagram from the input box.




## Getting Started



### 📦 Prerequisites



- Node (v12.0.0+)



- Npm (v6.00+)



### ⚙️ How To Use




1. Clone this repository



```bash
git clone https://github.com/yasinatesim/instagram-fullsize-picture.git
```



2. Add .env file on root

```bash
# There is an `encrypt` function in the project, please follow https://github.com/yasinatesim/instagram-fullsize-picture/issues/6#issuecomment-1424191150
NEXT_PUBLIC_ADMIN_PASSWORD='{{your-admin-password}}'

# Your Firebase - Firestore Database info -> https://console.firebase.google.com/
NEXT_PUBLIC_FIREBASE_PRIVATE_KEY=''
NEXT_PUBLIC_FIREBASE_PROJECT_ID=''
NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL=''

# You need Google Recaptcha token for below field and you should add *localhost* domain in Google Recaptcha console "Domains" section
# https://www.google.com/recaptcha/admin/create
NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# You need an Instagram account, please enter your Instagram account Username and Password
NEXT_PUBLIC_IG_USERNAME=
NEXT_PUBLIC_IG_PASSWORD=

# You need Instagram device string, please choose one on this link -> https://github.com/dilame/instagram-private-api/blob/623a348343e34058c3a286693740aa3698aed3cc/src/samples/devices.json
NEXT_PUBLIC_IG_DEVICE_STRING=

# The project uses to dilame/instagram-private-api.The library has `generateDevice` function and the function return the below fields. Please run this function in the dilame/instagram-private-api project and enter the below fields

# https://github.com/dilame/instagram-private-api/blob/623a348343e34058c3a286693740aa3698aed3cc/src/core/state.ts#L245
NEXT_PUBLIC_IG_DEVICE_ID=
NEXT_PUBLIC_IG_UUID=
NEXT_PUBLIC_IG_PHONE_ID=
NEXT_PUBLIC_IG_ADID=
NEXT_PUBLIC_IG_BUILD=

```


3. Install the project dependencies


```bash
yarn install
```



**For Development**



```bash
yarn dev
```

App is running on [http://localhost:3000](http://localhost:3000)



**For Production Build & Build Start**



```bash
yarn build
```


and





```bash
yarn start
```




**For Lint & Format**



```bash
yarn lint
yarn format
```





## 🔑 License

* Copyright © 2021 - MIT License.

See `LICENSE` for more information.

