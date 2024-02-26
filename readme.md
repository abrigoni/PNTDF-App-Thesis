# React Native Panal Starter

## How to use it
1. Clone this repo
2. Merge desired branches. Some tips:
    - Ignore changes in Podfile.lock and package-lock.json
    - Normally "merge both" is the correct way
3. `npm install`
4. `cp .env.yaml.example .env.yaml`
5. `npx rnuc .env.yaml`

## Commands and tricks
### Make the project almost like new
`npm run clean:all`
### Install ios dependencios (only in mac)
`npm run ios:pod:install`
### Add Fonts
1. Copy fonts to assets/fonts/
2. `npx react-native link`
### Rename application
1. `npx react-native-rename <newName> -b <newBundleIdentifier>`
2. In `android/app/proguard-rules.pro`
    - Change `-keepclassmembers class <currentBundleIdentifier>.BuildConfig`
    - to `-keepclassmembers class <newBundleIdentifier>.BuildConfig`
3. Check app names in:
    - `android/app/src/main/res/values/strings.xml` update `app_name` value
    - `ios/<AppName>/Info.plist` update `CFBundleDisplayName` key-value
4. Maybe you will have to clean either android or ios projects
### Generate Splash
- Run `npm run splash: generate -- --background-color="<HexaColorWithout#>"`
- Example `npm run splash:generate -- --background-color="358284"`
### Generate Icon
Icon is located in `assets/images/icon.png`
#### iOS
`npm run icon:generate -- --platform ios --background "<HexaColor>"`
#### Android
1. Open Android Studio
2. Open project from `android` folder
3. Wait till gradle finish sync. You'll notice beacuse project libs will be in diferent folders
4. Right click "app" > New > Image Assets
5. Set Icon Type to Adaptative and legacy (default)
6. Foreground: look for `assets/images/icon.png`
7. Ajust size taking into account the limits in preview
8. Background: choose a color that matches icon background
9. Next > Finish
## More (needs explanation)
```bash
# ios release
# localhost http uncomment Info.plist NSAppTransportSecurity section

# setup
cp .env.yaml.example .env.yaml
npx rnuc .env.yaml <-- When starting project and every time .env.yaml is changed
```
# TODO
- Modal
- Better readme
- Better example
