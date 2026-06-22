# Sprint 1 — Upload Instructions

## Files to upload and where they go

| File | GitHub destination path |
|---|---|
| LeadForm.tsx | src/components/LeadForm.tsx |
| SiteLayout.tsx | src/components/SiteLayout.tsx |
| sitemap.xml | public/sitemap.xml |
| robots.txt | public/robots.txt |
| vercel.json | vercel.json (root) |

## How to upload each file to GitHub

1. Go to github.com/telemasterindia/wehelpfinance
2. Navigate to the correct folder (e.g. click "src" → "components")
3. Click "Add file" → "Upload files"
4. Upload the file
5. Click "Commit changes"
6. Repeat for each file

## After all 5 files are uploaded

Vercel will auto-deploy within 2 minutes.
Then:
1. Go to Vercel → your wehelpfinance project → Domains
2. Add wehelpfinance.com
3. Update DNS in Hostinger with records Vercel provides

## One manual step required

In SiteLayout.tsx line 8:
const CLARITY_ID = "your-clarity-id";

Replace with your real Microsoft Clarity ID:
1. Go to clarity.microsoft.com
2. Create free account
3. Add new project → Website → wehelpfinance.com
4. Copy the Project ID (looks like: abcd1234ef)
5. Replace "your-clarity-id" with that ID
6. Re-upload SiteLayout.tsx

## Verify leads are working

After deploy:
1. Go to wehelpfinance.com
2. Fill out the form completely
3. Check telemasterindia@gmail.com for the lead email
4. Subject line will say: "New Lead — Debt Relief | TX"

## Web3Forms key already wired
Key: 19b473ef-4a3d-4d3e-807d-82ed6bb3be99
Same key used on ExclusiveLeads.biz — already verified working.
