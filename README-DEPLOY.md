# CLAUSE-SA-1.0.0 - hosting and Microsoft Store guide

You will do this in five parts. Allow about 1 hour for Parts A-B and a few days for Store review.

| Part | What | Where |
|---|---|---|
| A | Put the app online (free) | github.com |
| B | Check it works and installs | Microsoft Edge |
| C | Reserve the app and create the Pro subscriptions | Partner Center |
| D | Package the app for the Store | pwabuilder.com |
| E | Submit for certification | Partner Center |

## What is in this package
| File / folder | Purpose |
|---|---|
| `index.html` | The whole app (single file) |
| `manifest.webmanifest` | Tells Windows/Edge how to install the app (name, icons, colours, screenshots) |
| `sw.js` | Service worker: offline start-up and automatic updates |
| `privacy.html`, `terms.html` | Privacy Policy and Terms of Use (the Store requires a privacy URL) |
| `icons/` | App icons (standard and maskable) |
| `screenshots/` | Four 1920x1080 screenshots for the Store listing |
| `STORE-LISTING.md` | Text to paste into the Store listing, plus notes for certification |

Keep the folder structure exactly as it is.

---
## Part A - Put the app online with GitHub Pages
1. **Unzip** `CLAUSE-SA-1.0.0.zip` on your PC. Open the unzipped folder; you should see `index.html`, `sw.js`, `icons`, and so on directly inside it.
2. Sign in at github.com. Click **+ (top right) -> New repository**.
   - Repository name: `clause-sa` (lower case, no spaces)
   - Choose **Public** (free GitHub Pages needs a public repository)
   - Tick **Add a README file**, then **Create repository**.
3. In the repository click **Add file -> Upload files**.
4. Open the unzipped folder in File Explorer, press **Ctrl+A** to select everything **inside** it, and **drag it all** onto the GitHub page. Wait until every file and folder (`icons`, `screenshots`) shows in the list. (Do not drag the outer folder itself, or your files end up one level too deep.)
5. Scroll down and click **Commit changes**.
6. Go to **Settings -> Pages**. Under *Build and deployment*: Source = **Deploy from a branch**; Branch = **main**, folder = **/(root)**; click **Save**.
7. Wait 1-2 minutes and refresh the Pages screen. It shows your address:
   `https://YOUR-USERNAME.github.io/clause-sa/`
   Write it down; you will use it below.

If you see a 404 page: check that `index.html` is at the top level of the repository (not inside another folder), and wait a few more minutes.

## Part B - Check it works
1. Open your address in **Microsoft Edge**. You should see the *Create your account* screen with the CLAUSE logo.
2. In the address bar an **install** icon (a small screen with a plus) should appear. Click it and **Install**, then open the installed app and create a test account.
3. Press **F12** (DevTools) -> **Application**: *Manifest* should show no errors and *Service workers* should say "activated and is running".
4. In the same DevTools tick **Network -> Offline** and reload. The app should still open (on the Free plan you will see the "Internet connection required" screen by design).
5. Open `https://YOUR-USERNAME.github.io/clause-sa/privacy.html` to check the privacy page loads.

You can delete the test account in the app (Profile -> Delete account and all data) or just uninstall the test app.

## Part C - Partner Center: reserve the app and create the Pro subscriptions
1. Go to **partner.microsoft.com/dashboard** and sign in with your developer account.
2. **Apps and games -> New product -> MSIX or PWA app.** Reserve the name *CLAUSE Statistical Assessment* (or the nearest free name).
3. Open your app, then **Product management -> Product identity**. Copy and keep these three values:
   - **Package ID** (Package/Identity/Name)
   - **Publisher ID** (starts with `CN=`)
   - **Publisher display name**
4. Create the subscriptions: in your app choose **Add-ons -> New add-on -> Subscription** and create two:

| Product ID (must match exactly) | Billing period |
|---|---|
| `clause_pro_monthly` | 1 month |
| `clause_pro_yearly` | 1 year |

   Set prices, availability and a title/description for each. The app finds the add-ons by their Product ID. If you want different IDs, open `index.html`, search for `PRO_IDS`, and change the two names there to match.
5. Before you can be paid, complete **Account settings -> Payout and tax** in Partner Center. Check what Pakistan-based publishers must provide.

## Part D - Package the app with PWABuilder
1. Go to **pwabuilder.com**, paste your GitHub Pages address, and click **Start**.
2. If it lists problems, tell me what it says. It should report a valid manifest and service worker.
3. Click **Package for stores**, then **Windows -> Generate package**.
4. In the **Windows Package Options** dialog, paste the three values from Part C (Package ID, Publisher ID, Publisher display name). Set the version to **1.0.0.0**. Generate and download.
5. The download is a `.zip` containing an `.msixbundle` and a `.classic.appxbundle`. Unzip it. Do **not** use the `.sideload.msix` file for the Store; it is for testing only.

## Part E - Submit
1. In Partner Center open your app and click **Start your submission**.
2. **Pricing and availability:** Free; choose markets.
3. **Properties:** category *Productivity*. **Age ratings:** answer the questionnaire (no objectionable content in the app).
4. **Packages:** upload **both** the `.msixbundle` and the `.classic.appxbundle`.
5. **Store listing:** copy the text from `STORE-LISTING.md` and upload the four screenshots from `screenshots/`. Use your Part A address for the privacy policy URL: `https://YOUR-USERNAME.github.io/clause-sa/privacy.html`
6. **Notes for certification:** paste the notes from `STORE-LISTING.md`.
7. Submit. Review often takes a couple of days. Fix anything certification reports and resubmit.

---
## Testing purchases
The purchase check works only in a copy installed **from the Store** (Microsoft Edge 134 or newer on the PC). It does not work in the browser. After the first version is certified, install it from the Store with a test account, test buying and restoring a subscription, and then announce it.

## Releasing an update
1. In GitHub open the file, click the pencil (Edit), paste the new content, **Commit changes**. (Or upload the new files again.)
2. Change `VERSION` at the top of `sw.js` (for example `sa-1.0.1`) so devices refresh their stored copy.
3. Installed apps pick up the new web files automatically when online. You only need a new Store submission if the manifest or package identity changes.

## Settings you may want to change (all in `index.html`)
| Search for | What it controls |
|---|---|
| `FREE={computed:10,completed:5}` | Free-plan weekly limits (reports computed / completed; week = Monday to Sunday) |
| `PRO_DAYS=14` | How long a Pro subscription is trusted offline before it must be re-confirmed online |
| `PRO_IDS` | The two subscription Product IDs |

If you change a limit, also change the numbers in `privacy.html`, `terms.html` and `STORE-LISTING.md`.

## Things to know
- **Subscription checks happen on the device.** Microsoft recommends also verifying purchases on a server. For a first version this is a known trade-off: a determined technical user could bypass the limits.
- **No advertising and no analytics** are included. If you add them later, update `privacy.html` first.
- **Icons** are made from the small logo file. If you have a large version of the CLAUSE emblem (SVG, or PNG of 1024 px or more), send it and the icons can be made crisper.
- **Legal text:** `privacy.html` and `terms.html` are plain-language drafts written for this app. Have them reviewed, especially the governing-law clause (it names Pakistan).
- **Contact email** used in the app and legal pages: connect.proffsen@gmail.com
