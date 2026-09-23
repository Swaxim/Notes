# Quartz v5 Digital Garden Access & Deployment Guide

This guide details how to access your digital garden on other devices locally, and how to publish it permanently to the web.

---

## 📱 Local Network (Wi-Fi) Access

The local Quartz preview server is configured to accept connections from other devices on the same local network by default.

### Step 1: Find your computer's local IP address
1. Open terminal (Command Prompt or PowerShell) on this computer.
2. Run the command:
   ```powershell
   ipconfig
   ```
3. Locate your active network adapter (e.g., "Wireless LAN adapter Wi-Fi").
4. Note down the **IPv4 Address** (typically starts with `192.168.x.x` or `10.x.x.x`).

### Step 2: Access the server on another device
1. Connect your other device (phone, tablet, or another computer) to the **same Wi-Fi network**.
2. Run the preview server on this computer inside the `quartz/` folder:
   ```powershell
   npx quartz build --serve
   ```
3. On your other device, open a web browser and visit:
   ```
   http://<your-ipv4-address>:8080
   ```
   *(For example: `http://192.168.1.15:8080`)*

---

## 🌐 Permanent Public Web Hosting (GitHub Pages)

Your vault is connected to the GitHub repository **Fake1Doge/Obsidian-notes**. You can host the compiled website online for free using GitHub Actions.

### Step 1: Enable GitHub Actions Deployment
1. Go to your repository settings on GitHub:
   [https://github.com/Fake1Doge/Obsidian-notes](https://github.com/Fake1Doge/Obsidian-notes)
2. In the top tabs, click **Settings**.
3. In the left sidebar, under "Code and automation", click **Pages**.
4. Under the **Build and deployment** section, look for **Source**.
5. Change the dropdown from "Deploy from a branch" to **GitHub Actions**.

### Step 2: Push changes and build
Your vault backup program will automatically sync the configuration files. Once the changes are pushed, GitHub will automatically trigger the deployment workflow.
* You can check the build status by clicking the **Actions** tab on your repository page.
* Once the build completes, your website will be live at:
  [https://fake1doge.github.io/Obsidian-notes/](https://fake1doge.github.io/Obsidian-notes/)
