# 🎯 Quick Reference Card

## 📱 Essential Links

### Your Deployment Dashboard
```
🔵 Railway:  https://railway.app/dashboard
🟢 Vercel:   https://vercel.com/dashboard
🟡 MongoDB:  https://cloud.mongodb.com
🟠 GitHub:   https://github.com/tlashla373/workie.lk
```

### Documentation
```
📘 Main Guide:      DEPLOYMENT_GUIDE.md
✅ Checklist:       DEPLOYMENT_CHECKLIST.md
💻 Commands:        DEPLOYMENT_COMMANDS.md
🏗️  Architecture:   DEPLOYMENT_ARCHITECTURE.md
📋 Summary:         DEPLOYMENT_SUMMARY.md
```

---

## ⚡ Quick Commands

### Setup
```bash
# Windows
setup-deployment.bat

# Linux/Mac
chmod +x setup-deployment.sh && ./setup-deployment.sh
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend
```bash
curl https://your-backend.railway.app/api/health
```

### Deploy Update
```bash
git add .
git commit -m "Update message"
git push origin main
```

---

## 🔑 Environment Variables

### Backend (Railway)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<32-char-random>
CLOUDINARY_CLOUD_NAME=<value>
CLOUDINARY_API_KEY=<value>
CLOUDINARY_API_SECRET=<value>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<email>
EMAIL_PASSWORD=<app-password>
FRONTEND_URL=<vercel-url>
```

### Frontend (Vercel)
```env
VITE_API_URL=https://<railway-url>/api
VITE_SOCKET_URL=https://<railway-url>
```

---

## 📋 Deployment Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy Backend to Railway
3. ✅ Deploy Frontend to Vercel
4. ✅ Update Backend with Frontend URL
5. ✅ Test everything

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| CORS Error | Update `FRONTEND_URL` in Railway |
| API Not Found | Check `VITE_API_URL` includes `/api` |
| Socket.IO fails | Verify `VITE_SOCKET_URL` (no `/api`) |
| Build fails | Check logs, verify dependencies |
| DB connection | Verify MongoDB URI, check IP whitelist |

---

## 💰 Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway | $5 credit/mo | $20/mo |
| Vercel | FREE | $20/mo |
| MongoDB | 512MB FREE | From $9/mo |
| Cloudinary | 25 credits/mo | From $89/mo |
| **Total** | **~$0-5/mo** | **~$50-150/mo** |

---

## 📞 Get Help

1. Check service logs (Railway/Vercel dashboards)
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors
5. Review documentation files

---

## 🎉 Success Checklist

- [ ] Backend live on Railway
- [ ] Frontend live on Vercel
- [ ] Can login/signup
- [ ] Can upload images
- [ ] Real-time notifications work
- [ ] Email notifications work
- [ ] Mobile responsive
- [ ] HTTPS enabled

---

**Your URLs After Deployment:**

Frontend: `https://_____________.vercel.app`

Backend:  `https://_____________.up.railway.app`

---

**Ready?** Open [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) and start! 🚀
