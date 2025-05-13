import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import os from 'os';

const rootDesign = (req: Request, res: Response) => {
  // Get system uptime (in hours, minutes)
  const uptime = os.uptime(); // seconds
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);

  // Get CPU load (average over last 1 min)
  const loadAverage = os.loadavg()[0]; // 1-min avg

  // Get memory usage
  const totalMem = os.totalmem() / (1024 * 1024 * 1024); // GB
  const freeMem = os.freemem() / (1024 * 1024 * 1024); // GB
  const usedMem = totalMem - freeMem;

  // Get last check timestamp
  const lastCheck = new Date().toLocaleTimeString();

  res.status(StatusCodes.OK).send(`
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Server Status</title>
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
       <style>
         :root {
           --primary: #003462;
           --secondary: #f37335;
           --accent: #fdc830;
           --text: #333333;
           --light: #ffffff;
           --background: #f5f5f5;
           --border-radius: 8px;
           --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
         }
         
         * {
           margin: 0;
           padding: 0;
           box-sizing: border-box;
         }
         
         body {
           font-family: 'Poppins', sans-serif;
           background-color: var(--background);
           color: var(--text);
           line-height: 1.6;
           padding: 0;
           margin: 0;
           min-height: 100vh;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
         }
         
         .header {
           background: linear-gradient(135deg, var(--primary), #004e92);
           width: 100%;
           padding: 20px 0;
           text-align: center;
           margin-bottom: 40px;
           color: var(--light);
         }
         
         .container {
           max-width: 800px;
           width: 90%;
           margin: 0 auto 40px;
           padding: 30px;
           border-radius: var(--border-radius);
           background: var(--light);
           box-shadow: var(--box-shadow);
         }
         
         h1 {
           color: var(--light);
           font-weight: 600;
           margin-bottom: 10px;
           font-size: 28px;
         }
         
         h2 {
           color: var(--primary);
           font-weight: 600;
           margin-bottom: 20px;
           font-size: 24px;
           text-align: center;
         }
         
         .status-box {
           background: rgba(0, 52, 98, 0.03);
           padding: 25px;
           border-radius: var(--border-radius);
           margin-bottom: 25px;
           border-left: 4px solid var(--primary);
         }
         
         .status-item {
           margin-bottom: 15px;
           display: flex;
           align-items: center;
         }
         
         .status-item-label {
           font-weight: 500;
           color: var(--primary);
           min-width: 150px;
         }
         
         .status-item-value {
           font-weight: 400;
           color: var(--text);
         }
         
         .button-container {
           display: flex;
           justify-content: center;
           gap: 15px;
           margin-top: 30px;
           flex-wrap: wrap;
         }
         
         .btn-primary {
           background-color: var(--primary);
           color: var(--light);
           border: none;
           padding: 12px 24px;
           font-family: 'Poppins', sans-serif;
           font-size: 14px;
           font-weight: 500;
           border-radius: var(--border-radius);
           cursor: pointer;
           transition: all 0.3s ease;
           text-decoration: none;
           display: inline-block;
           box-shadow: 0 4px 8px rgba(0, 52, 98, 0.2);
         }
         
         .btn-primary:hover {
           background-color: #00284d;
           transform: translateY(-2px);
           box-shadow: 0 6px 12px rgba(0, 52, 98, 0.3);
         }
         
         .btn-secondary {
           background-color: var(--secondary);
           color: var(--light);
           border: none;
           padding: 12px 24px;
           font-family: 'Poppins', sans-serif;
           font-size: 14px;
           font-weight: 500;
           border-radius: var(--border-radius);
           cursor: pointer;
           transition: all 0.3s ease;
           text-decoration: none;
           display: inline-block;
           box-shadow: 0 4px 8px rgba(243, 115, 53, 0.2);
         }
         
         .btn-secondary:hover {
           background-color: #e56120;
           transform: translateY(-2px);
           box-shadow: 0 6px 12px rgba(243, 115, 53, 0.3);
         }
         
         .links {
           margin-top: 30px;
           display: flex;
           justify-content: center;
           flex-wrap: wrap;
           gap: 20px;
         }
         
         .links a {
           color: var(--primary);
           text-decoration: none;
           font-weight: 500;
           transition: color 0.3s ease;
           position: relative;
         }
         
         .links a::after {
           content: '';
           position: absolute;
           width: 0;
           height: 2px;
           bottom: -2px;
           left: 0;
           background-color: var(--secondary);
           transition: width 0.3s ease;
         }
         
         .links a:hover {
           color: var(--secondary);
         }
         
         .links a:hover::after {
           width: 100%;
         }
         
         .footer {
           margin-top: auto;
           width: 100%;
           background-color: var(--primary);
           color: var(--light);
           text-align: center;
           padding: 15px 0;
           font-size: 14px;
         }
         
         .online-badge {
           display: inline-block;
           background-color: #4CAF50;
           color: white;
           padding: 4px 8px;
           border-radius: 4px;
           font-size: 12px;
           font-weight: 500;
           margin-left: 10px;
         }
         
         @media (max-width: 768px) {
           .container {
             width: 95%;
             padding: 20px;
           }
           
           .status-item {
             flex-direction: column;
             align-items: flex-start;
           }
           
           .status-item-label {
             margin-bottom: 5px;
           }
           
           .button-container {
             flex-direction: column;
             width: 100%;
           }
           
           .btn-primary, .btn-secondary {
             width: 100%;
             text-align: center;
           }
         }
       </style>
     </head>
     <body>
       <div class="header">
         <h1>Server Status</h1>
       </div>
       
       <div class="container">
         <h2>Server Status Dashboard</h2>
         
         <div class="status-box">
           <div class="status-item">
             <div class="status-item-label">System Status:</div>
             <div class="status-item-value">
               Online
               <span class="online-badge">ACTIVE</span>
             </div>
           </div>
           
           <div class="status-item">
             <div class="status-item-label">Uptime:</div>
             <div class="status-item-value">${uptimeHours}h ${uptimeMinutes}m</div>
           </div>
           
           <div class="status-item">
             <div class="status-item-label">CPU Load:</div>
             <div class="status-item-value">${loadAverage.toFixed(2)}%</div>
           </div>
           
           <div class="status-item">
             <div class="status-item-label">Memory Usage:</div>
             <div class="status-item-value">${usedMem.toFixed(1)} GB / ${totalMem.toFixed(1)} GB</div>
           </div>
           
           <div class="status-item">
             <div class="status-item-label">Last Check:</div>
             <div class="status-item-value">${lastCheck}</div>
           </div>
         </div>
         
         <div class="button-container">
           <form action="/" method="get">
             <button type="submit" class="btn-primary">Refresh Status</button>
           </form>
           <a href="/health" class="btn-secondary">Health Check</a>
         </div>
       </div>
       
       <div class="footer">
         © ${new Date().getFullYear()} Maulik Pankhania. All Rights Reserved.
       </div>
     </body>
   </html>
   `);
};

export default rootDesign;
