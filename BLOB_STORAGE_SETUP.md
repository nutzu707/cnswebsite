# Vercel Blob Storage Setup Guide

## ✅ What Was Changed

Your website now uses **Vercel Blob Storage** instead of the local filesystem for all uploaded files. This means:

- ✅ **Files persist between deployments**
- ✅ **Works on Vercel production** (no more read-only filesystem issues)
- ✅ **Automatic CDN** for fast file delivery worldwide
- ✅ **No Git commits needed** for uploaded files

## 📋 Pages Updated to Use Blob Storage

### Dashboard (`/dashboard`)
- ✅ Documente Management
- ✅ Documente Elevi
- ✅ Documente Profesori
- ✅ CJEX Salaj
- ✅ Arhiva Foto

### Public Pages
- ✅ `/management-documente`
- ✅ `/elevi-documente`
- ✅ `/profesori-documente`
- ✅ `/cjex-salaj`
- ✅ `/arhiva-foto`

## 🚀 Setup Instructions

### Step 1: Link Your Project to Vercel

If you haven't already, run:

```bash
vercel link
```

Follow the prompts to connect your local project to your Vercel deployment.

### Step 2: Get Environment Variables

Run this command to pull your Vercel environment variables (including the Blob token):

```bash
vercel env pull
```

This will create/update your `.env.local` file with `BLOB_READ_WRITE_TOKEN`.

### Step 3: Verify the Token

Check that `.env.local` contains:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

If it doesn't, you can manually create it at:
https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### Step 4: Test Locally

Start your development server:

```bash
npm run dev
```

Go to `http://localhost:3000/dashboard` and try:
1. Uploading a document
2. Viewing it in the list
3. Deleting it

### Step 5: Deploy

```bash
git add .
git commit -m "Migrate to Vercel Blob Storage"
git push
```

Or deploy directly:

```bash
vercel --prod
```

## 📁 Blob Storage Structure

Files are organized by folder in Vercel Blob:

```
documents/
  └── documente-management/
      └── file1.pdf
  └── documente-elevi/
      └── file2.pdf
  └── documente-profesori/
      └── file3.pdf
  └── cjex-salaj/
      └── file4.pdf
arhiva-foto/
  └── image1.jpg
  └── image2.png
```

## 🔧 New API Routes

### Upload Files
```
POST /api/blob/upload?filename=document.pdf&folder=documents/documente-management
Body: File binary data
```

### List Files
```
GET /api/blob/list?folder=documents/documente-management
```

### Delete Files
```
DELETE /api/blob/delete?url=https://blob.vercel-storage.com/...
```

## 💰 Pricing

Vercel Blob Storage pricing (as of Dec 2024):

- **Free Tier**: 500 MB storage, 1 GB bandwidth/month
- **Pro**: $0.15/GB storage, $0.30/GB bandwidth
- **Enterprise**: Custom pricing

For a school website with ~100-200 documents and photos, you'll likely stay within the free tier or pay just $1-2/month.

## 🔄 Migrating Existing Files

If you have existing files in `public/uploads/`, you'll need to upload them through the dashboard:

1. Go to `/dashboard`
2. For each section (Management, Elevi, etc.):
   - Click "Choose File"
   - Select your existing files
   - Click "Upload"
3. Files will now be in Blob Storage

## 📝 Notes

### What's Still Using Filesystem (Git-committed files):
- News articles JSON (`public/uploads/news/*.json`) - Still uses filesystem, will need migration if you want to manage via dashboard
- Projects JSON (`public/uploads/projects/*.json`) - Still uses filesystem
- Conducere JSON (`public/uploads/conducere/*.json`) - Still uses filesystem
- Consiliu JSON (`public/uploads/consiliu-de-administratie/*.json`) - Still uses filesystem

These can stay in Git since they're small JSON files that you may want version-controlled.

### Documents Now in Blob Storage:
- All PDFs, DOCs, XLS files in document sections
- All images in Arhiva Foto

## ⚠️ Important

- The old filesystem-based upload won't work on Vercel production (filesystem is read-only)
- Always use the new Blob Storage system for file uploads
- Old files in `public/uploads/documents/` and `public/uploads/arhiva-foto/` are not automatically migrated - you must re-upload them

## 🐛 Troubleshooting

### "Failed to upload file"
- Check that `BLOB_READ_WRITE_TOKEN` is set in your environment
- Run `vercel env pull` again

### "No documents available" in dashboard
- This is normal if you haven't uploaded any files yet to Blob Storage
- Old files in `public/uploads/` won't appear - they need to be re-uploaded

### Files disappear after deployment
- You're probably still using the old filesystem-based upload
- Make sure you're using the updated dashboard that uses Blob Storage

## 📚 Learn More

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob Pricing](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)

