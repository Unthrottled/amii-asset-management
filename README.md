<p align="center"><img style="object-fit: contain" src="https://media1.tenor.com/images/ad3066e5f05ec16ae49a568a4ac996be/tenor.gif?itemid=16686762"></p>


# AMII Asset Management UI

A convenient administration dashboard that makes viewing, uploading, and editing the [AMII's](https://github.com/Unthrottled/AMII) assets.

## Usage

Whenever you make any changes to any of the assets, a `Sync Changes` button will appear in the bottom right-hand corner of the application.
The application works by keeping thing cached locally. 
If you where to refresh your browser before syncing your changes, you will lose any changes not synced to the appropriate bucket.

That being said, you are free to navigate to other areas of the application using the navigation side bar.
Such as if you need to add a new waifu definition, after you have dropped in a bunch of new assets.

**Roles**

Any authenticated user has the ability to view all the assets available!
However, only users in the `Admin` group have the ability to create, update, and delete assets.

At the moment you have the ability to:

- [View all assets](https://amii-assets.unthrottled.io/)
- [Edit Asset](https://amii-assets.unthrottled.io/assets/view/9a8d07c228d234bd97227e6f65d8ffd1)
- [Upload Assets](https://amii-assets.unthrottled.io/asset/upload)
- [Categorize Assets](https://amii-assets.unthrottled.io/character/definition)

### Asset Categorization

[Asset categorization](https://amii-assets.unthrottled.io/character/definition) enables us to define and group Waifu by the anime they appear in.
If you want to tag a waifu in an asset, you'll have to create her definition inside the anime she appears in.

### Edit Assets

[Editing an asset](https://amii-assets.unthrottled.io/assets/view/79a4f43c4ba8c7f28fdbc7ea4a598547) allows you to:

- Define character tags.
- What kind of asset categories it belongs to
- Add/update/remove any related assets
- Add/Update the image alt.

You will **not** be able to change the image path after an asset has been uploaded.

## Local Development

### Prerequisites

- [Yarn Package Manager](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

**React Notes**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn`

This will install of the applications dependencies defined in the `package.json` at the root of this repository.
**You will need to run this after cloning the project**.

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## AWS Amplify 

This application uses the [AWS Amplify](https://aws.amazon.com/amplify/) platform.

**Any commits to master will be automatically built and deployed to production!**

**Handy commands**
`npm install -g @aws-amplify/cli`
`amplify pull`

> Note: this is only needed if any of the platform needs to be updated. It is **not** required to do local development.

**Handy links**

- https://docs.amplify.aws/lib/auth/social/q/platform/js
- https://aws.amazon.com/blogs/mobile/building-fine-grained-authorization-using-amazon-cognito-user-pools-groups/
- https://stackoverflow.com/questions/44043289/aws-invalid-identity-pool-configuration-check-assigned-iam-roles-for-this-poo

aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-bucket
aws --endpoint-url=http://localhost:4566 s3api put-bucket-acl --bucket demo-bucket --acl public-read
