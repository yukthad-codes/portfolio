# GitHub Pages Deployment Troubleshooting

## Common Issues and Solutions

### 🚫 "Get Pages site failed" Error

**Problem**: The GitHub Actions workflow fails with "Not Found" error.

**Solutions**:

1. **Enable GitHub Pages First**
   ```
   Repository → Settings → Pages → Source → "GitHub Actions"
   ```

2. **Check Repository Visibility**
   - Repository must be **Public** (or you need GitHub Pro/Team for private repos)
   - Go to Settings → General → scroll to bottom → Change visibility if needed

3. **Verify Permissions**
   - Go to Settings → Actions → General
   - Under "Workflow permissions" select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

### 🔄 Workflow Keeps Failing

**Use the Fallback Method**:

1. **Disable the main deploy workflow**
   - Rename `.github/workflows/deploy.yml` to `.github/workflows/deploy.yml.disabled`

2. **Enable the fallback workflow**
   - Rename `.github/workflows/deploy-fallback.yml` to `.github/workflows/deploy-fallback.yml.active`

3. **Update Pages Settings**
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" (will be created automatically)

### 📁 Files Not Showing Up

**Check File Structure**:
```
your-repo/
├── index.html          ✅ Must be in root
├── style.css           ✅ Must be in root  
├── script.js           ✅ Must be in root
├── profile-photo.jpg   ✅ Images in root
├── project1.jpg        ✅ Images in root
└── .github/
    └── workflows/
        └── deploy.yml  ✅ Workflow files
```

### 🖼️ Images Not Loading

**Common Fixes**:

1. **Check File Names** (case-sensitive)
   ```html
   <!-- Wrong -->
   <img src="Profile-Photo.jpg">
   
   <!-- Correct -->
   <img src="profile-photo.jpg">
   ```

2. **Verify File Upload**
   - All image files must be committed to repository
   - Check in GitHub web interface that files are there

3. **Use Relative Paths**
   ```html
   <!-- Correct -->
   <img src="profile-photo.jpg">
   
   <!-- Avoid absolute paths -->
   <img src="/profile-photo.jpg">
   ```

### 🌐 Site Not Accessible

**Wait and Check**:
- GitHub Pages can take 5-10 minutes to deploy
- Check Actions tab for deployment status
- Try accessing in incognito/private browsing mode

**Verify URL Format**:
- Standard: `https://username.github.io/repository-name/`
- User site: `https://username.github.io/` (if repo named `username.github.io`)

### 📱 Mobile Issues

**Common Problems**:

1. **Missing Viewport Meta Tag**
   ```html
   <!-- Add this to <head> -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **CSS Not Loading on Mobile**
   - Check that CSS file is properly linked
   - Verify no typos in file names
   - Test on actual mobile device, not just browser dev tools

### 🔧 Quick Fixes

#### Reset GitHub Pages
1. Settings → Pages → Source → "None" → Save
2. Wait 1 minute
3. Settings → Pages → Source → "GitHub Actions" → Save

#### Force Workflow Re-run
1. Go to Actions tab
2. Click on failed workflow
3. Click "Re-run all jobs"

#### Manual Deployment Test
```bash
# Clone your repo locally
git clone https://github.com/username/portfolio.git
cd portfolio

# Test locally
python -m http.server 8000
# Visit http://localhost:8000
```

### 🆘 Still Having Issues?

**Check These**:

1. **Repository Settings**
   - [ ] Repository is public
   - [ ] Pages is enabled
   - [ ] Correct source selected
   - [ ] Actions have proper permissions

2. **File Structure**
   - [ ] `index.html` in root directory
   - [ ] All CSS/JS files in root
   - [ ] All images uploaded and named correctly

3. **Workflow Status**
   - [ ] Check Actions tab for errors
   - [ ] Look at workflow logs for specific error messages
   - [ ] Try the fallback deployment method

4. **Browser Issues**
   - [ ] Clear browser cache
   - [ ] Try incognito/private mode
   - [ ] Test on different browsers/devices

### 📞 Getting Help

If you're still stuck:

1. **Check GitHub Status**: https://www.githubstatus.com/
2. **GitHub Community**: https://github.community/
3. **Stack Overflow**: Tag your question with `github-pages`

Remember: Most deployment issues are resolved by ensuring GitHub Pages is properly enabled BEFORE running workflows! 🎯