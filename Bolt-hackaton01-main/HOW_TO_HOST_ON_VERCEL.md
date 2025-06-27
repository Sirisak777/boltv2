# วิธีการโฮสต์โปรเจกต์นี้บน Vercel

เอกสารนี้จะอธิบายขั้นตอนการโฮสต์โปรเจกต์นี้ ซึ่งประกอบด้วย Frontend (React + Vite) และ Backend (Express.js) บน Vercel

## โครงสร้างโปรเจกต์สำหรับ Vercel

เพื่อให้โปรเจกต์นี้สามารถทำงานบน Vercel ได้อย่างถูกต้อง เราได้มีการปรับเปลี่ยนและกำหนดค่าดังนี้:

- **Backend (Server API):**
    - โค้ด Express.js API อยู่ในไดเรกทอรี `Bolt-hackaton01-main/server/server.js`
    - Vercel จะทำการ build และ deploy API นี้เป็น Serverless Function
    - Path ของ API จะถูก rewrite จาก `/api/*` ไปยัง `Bolt-hackaton01-main/server/server.js` โดยอัตโนมัติ (ตามการตั้งค่าใน `Bolt-hackaton01-main/vercel.json`)
- **Frontend (React Application):**
    - โค้ด React application อยู่ในไดเรกทอรี `Bolt-hackaton01-main/src`
    - Vercel จะทำการ build frontend โดยใช้คำสั่ง `npm run build` (หรือ `npm run vercel-build` ที่เราได้เพิ่มไว้ใน `package.json`)
    - ไฟล์ static ที่ได้จากการ build (อยู่ใน `Bolt-hackaton01-main/dist`) จะถูก serve โดย Vercel
- **ไฟล์กำหนดค่า Vercel (`Bolt-hackaton01-main/vercel.json`):**
    - ไฟล์นี้ใช้สำหรับบอก Vercel ว่าจะ build โปรเจกต์อย่างไร และจะจัดการ routing ของ request อย่างไร
    - **Builds Configuration:**
        - กำหนดให้ Vercel build `Bolt-hackaton01-main/server/server.js` โดยใช้ `@vercel/node` (สำหรับ Node.js serverless function)
        - กำหนดให้ Vercel build frontend โดยใช้ `@vercel/static-build` และ output ไปที่ `dist` directory
    - **Routes Configuration:**
        - Request ที่มายัง `/api/*` จะถูกส่งต่อไปยัง serverless function ที่ `Bolt-hackaton01-main/server/server.js`
        - Request อื่นๆ ทั้งหมด (`/(.*)`) จะถูกส่งต่อไปยัง static files ใน `Bolt-hackaton01-main/dist`

## ขั้นตอนการ Deploy บน Vercel

1.  **เชื่อมต่อ Git Repository:**
    *   ตรวจสอบให้แน่ใจว่าโปรเจกต์ของคุณถูก push ขึ้นไปยัง Git repository (เช่น GitHub, GitLab, Bitbucket)
    *   ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
    *   คลิก "Add New..." -> "Project"
    *   เลือก Git provider ของคุณและ import repository ที่ต้องการ deploy

2.  **ตั้งค่าโปรเจกต์ (Project Settings):**
    *   **Framework Preset:** Vercel ควรจะตรวจจับ Vite ได้โดยอัตโนมัติ หากไม่ ให้เลือก "Vite"
    *   **Build and Output Settings:**
        *   **Build Command:** Vercel ควรจะใช้ `npm run vercel-build` หรือ `npm run build` จาก `package.json` โดยอัตโนมัติ หากต้องการแก้ไข สามารถ override ได้ที่นี่ โดยปกติแล้วควรจะเป็น `vite build` หรือคำสั่งที่เราตั้งไว้ใน `package.json` คือ `npm run vercel-build`
        *   **Output Directory:** Vercel ควรจะตรวจจับ `dist` ได้โดยอัตโนมัติ หากไม่ ให้ตั้งค่าเป็น `Bolt-hackaton01-main/dist` (เนื่องจาก Vercel จะ run build command จาก root ของ repository ที่ import เข้ามา แต่ `package.json` ของเราอยู่ใน `Bolt-hackaton01-main/` ดังนั้น output directory ที่ถูกต้องเมื่อมองจาก root ของ Vercel project จะเป็น `Bolt-hackaton01-main/dist`)
        *   **Install Command:** โดยปกติจะเป็น `npm install` หรือ `yarn install` Vercel จะจัดการส่วนนี้ให้
    *   **Root Directory:**
        *   เนื่องจาก `package.json` และ `vercel.json` ของเราอยู่ใน `Bolt-hackaton01-main/` ให้ตั้งค่า **Root Directory** ใน Vercel เป็น `Bolt-hackaton01-main`
        *   **สำคัญมาก:** การตั้งค่า Root Directory นี้จะทำให้ Vercel มองเห็น `vercel.json` และ `package.json` ในตำแหน่งที่ถูกต้อง และ build ทั้ง frontend และ backend อย่างเหมาะสม

3.  **Environment Variables (ถ้ามี):**
    *   หากโปรเจกต์ของคุณต้องการ Environment Variables (เช่น API keys, database credentials) ให้ไปที่ "Settings" -> "Environment Variables" ของโปรเจกต์ใน Vercel Dashboard เพื่อเพิ่มค่าเหล่านั้น
    *   สำหรับโปรเจกต์นี้ ไม่มีการใช้ Environment Variables ที่ต้องตั้งค่าเป็นพิเศษ

4.  **Deploy:**
    *   คลิกปุ่ม "Deploy"
    *   Vercel จะเริ่มกระบวนการ build และ deploy โปรเจกต์ของคุณ
    *   คุณสามารถติดตามความคืบหน้าได้จาก Vercel Dashboard

5.  **ทดสอบ:**
    *   เมื่อ deploy เสร็จสิ้น Vercel จะให้ URL สำหรับเข้าถึงโปรเจกต์ของคุณ (เช่น `your-project-name.vercel.app`)
    *   ทดสอบการทำงานของทั้ง frontend และ API (เช่น ลอง register, login) เพื่อให้แน่ใจว่าทุกอย่างทำงานถูกต้อง

## ข้อควรจำ:

*   **Path ของ API:** หลังจาก deploy แล้ว API endpoint จะอยู่ที่ `https://your-project-name.vercel.app/api/register`, `https://your-project-name.vercel.app/api/login` เป็นต้น (ตามที่กำหนดใน `vercel.json` และการเรียกใช้ API ใน frontend)
*   **การอัปเดต:** ทุกครั้งที่คุณ push code ใหม่ไปยัง branch ที่เชื่อมต่อกับ Vercel (โดยทั่วไปคือ `main` หรือ `master`), Vercel จะทำการ build และ deploy โปรเจกต์ใหม่อัตโนมัติ

หากมีปัญหาในการ deploy หรือการตั้งค่า สามารถตรวจสอบ logs จาก Vercel Dashboard เพื่อหาสาเหตุและแก้ไขได้
