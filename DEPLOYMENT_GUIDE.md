# GitHub Pages Deployment Guide

## Quick Start (5 minutes)

### 1. Prepare Your Repository

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `portfolio` (or `[your-username].github.io` for custom domain)
   - Set to Public
   - Don't initialize with README (we already have files)

### 2. Upload Your Files

**Method 1: Drag & Drop (Easiest)**
1. Go to your new repository page
2. Click "uploading an existing file"
3. Drag all files from your portfolio folder:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - Your image files
4. Write commit message: "Add portfolio website"
5. Click "Commit changes"

**Method 2: Git Commands**
```bash
# Navigate to your portfolio folder
cd path/to/your/portfolio

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Add portfolio website"

# Connect to GitHub (replace with your details)
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

**IMPORTANT**: You must enable GitHub Pages BEFORE the workflows can deploy successfully.

#### Step-by-Step Setup:

1. **Go to Repository Settings**
   - Click **Settings** tab in your repository
   - Scroll to **Pages** section (left sidebar)

2. **Choose Deployment Method**

   **Option A: GitHub Actions (Recommended)**
   - Under **Source**: Select "GitHub Actions"
   - This enables automatic deployment via workflows
   - Your site deploys automatically when you push changes

   **Option B: Branch Deployment (Fallback)**
   - Under **Source**: Select "Deploy from a branch"
   - **Branch**: Select "main" 
   - **Folder**: Select "/ (root)"
   - Click **Save**

3. **Verify Setup**
   - You should see a green checkmark and URL after setup
   - The URL will be: `https://YOUR_USERNAME.github.io/REPO_NAME/`

#### If GitHub Actions Fails:
- Use the fallback workflow: `.github/workflows/deploy-fallback.yml`
- This creates a `gh-pages` branch for deployment
- Then set Pages source to "Deploy from branch" → "gh-pages"

### 4. Access Your Live Site

- **URL**: `https://YOUR_USERNAME.github.io/portfolio/`
- **Custom domain option**: If you named your repo `YOUR_USERNAME.github.io`, your site will be at `https://YOUR_USERNAME.github.io/`

⏰ **Wait time**: 5-10 minutes for first deployment

## Before You Deploy - Customization Checklist

### ✅ Required Updates in `index.html`:

- [ ] Replace `[Your Name]` with your actual name
- [ ] Update `[your-email]@example.com` with your email
- [ ] Replace `[your-profile]` with your LinkedIn username
- [ ] Replace `[your-username]` with your GitHub username
- [ ] Update project descriptions and GitHub links
- [ ] Add your bio and skills in the About section

### ✅ Add Your Images:

- [ ] `profile-photo.jpg` - Your professional photo (400x400px recommended)
- [ ] `project1.jpg` - First project screenshot (600x400px recommended)
- [ ] `project2.jpg` - Second project screenshot
- [ ] `project3.jpg` - Third project screenshot

### ✅ Optional Customizations:

- [ ] Update colors in `style.css` (search for `#3498db`, `#2c3e50`)
- [ ] Modify the gradient background in `.home` section
- [ ] Add more projects by copying `.project-card` sections
- [ ] Update social media links

## Image Guidelines

### Profile Photo
- **Size**: 400x400px (square)
- **Format**: JPG or PNG
- **Style**: Professional headshot with good lighting
- **Background**: Clean, simple background

### Project Screenshots
- **Size**: 600x400px (3:2 ratio)
- **Format**: JPG or PNG
- **Content**: Clear view of your project interface
- **Quality**: High resolution, crisp text

### Quick Image Optimization
- Use tools like TinyPNG or Squoosh.app to compress images
- Keep file sizes under 500KB for fast loading

## Troubleshooting

### Site Not Loading?
- Wait 10-15 minutes after enabling Pages
- Check that `index.html` is in the root directory
- Verify repository is public

### Images Not Showing?
- Ensure image files are uploaded to repository
- Check file names match exactly (case-sensitive)
- Verify image paths in HTML

### Mobile Issues?
- Test on actual devices or browser dev tools
- Check that viewport meta tag is present
- Verify responsive CSS is working

## GitHub Actions Workflows

Your portfolio includes two automated workflows:

### 1. **Deploy Workflow** (`.github/workflows/deploy.yml`)
- **Triggers**: Automatically runs when you push to main branch
- **Purpose**: Builds and deploys your site to GitHub Pages
- **Benefits**: No manual deployment needed, always up-to-date

### 2. **CI Workflow** (`.github/workflows/ci.yml`)
- **Triggers**: Runs on pushes and pull requests
- **Purpose**: Code quality checks, validation, and performance monitoring
- **Includes**:
  - HTML/CSS/JavaScript linting
  - File size monitoring
  - Accessibility testing
  - Performance checks

### Viewing Workflow Status
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. See all workflow runs and their status
4. Click on any run to see detailed logs

## Next Steps After Deployment

1. **Test thoroughly** on different devices and browsers
2. **Monitor Actions tab** for successful deployments
3. **Share your portfolio** on social media and with potential employers
4. **Keep it updated** with new projects and skills
5. **Monitor performance** using Google PageSpeed Insights
6. **Consider custom domain** for more professional appearance

## Custom Domain Setup (Optional)

1. Buy a domain from providers like Namecheap, GoDaddy
2. In repository Settings > Pages > Custom domain
3. Enter your domain (e.g., `yourname.dev`)
4. Update DNS settings with your domain provider
5. Enable "Enforce HTTPS"

## Performance Tips

- Optimize images before uploading
- Use WebP format for better compression
- Minimize CSS and JavaScript if needed
- Enable browser caching with proper headers

Your portfolio is now ready to impress potential employers and clients! 🚀