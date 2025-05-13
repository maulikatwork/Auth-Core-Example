import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import os from 'os';

const healthCheckUI = (req: Request, res: Response) => {
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

  // Calculate memory percentage
  const memoryPercentage = (usedMem / totalMem) * 100;

  // Determine health status
  const isHealthy = loadAverage < 90 && memoryPercentage < 90;

  res.status(StatusCodes.OK).send(`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Health Check</title>
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
          --success: #4CAF50;
          --warning: #ff9800;
          --danger: #f44336;
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
        
        .health-status {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 25px 0;
          padding: 15px;
          border-radius: var(--border-radius);
          font-weight: 600;
          font-size: 18px;
          color: var(--light);
          background-color: ${isHealthy ? 'var(--success)' : 'var(--warning)'};
        }
        
        .health-status-icon {
          margin-right: 10px;
          font-size: 24px;
        }
        
        .status-box {
          background: rgba(0, 52, 98, 0.03);
          padding: 25px;
          border-radius: var(--border-radius);
          margin-bottom: 25px;
          border-left: 4px solid var(--primary);
        }
        
        .status-item {
          margin-bottom: 20px;
        }
        
        .status-item:last-child {
          margin-bottom: 0;
        }
        
        .status-item-label {
          font-weight: 500;
          color: var(--primary);
          margin-bottom: 8px;
        }
        
        .progress-container {
          width: 100%;
          height: 12px;
          background-color: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 5px;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .progress-bar.cpu {
          background: linear-gradient(90deg, #2196F3, #03A9F4);
          width: ${Math.min(loadAverage, 100)}%;
        }
        
        .progress-bar.memory {
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          width: ${memoryPercentage.toFixed(1)}%;
        }
        
        .progress-value {
          font-size: 14px;
          color: var(--text);
          margin-top: 5px;
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
        
        .highlight {
          color: var(--secondary);
          font-weight: 600;
        }
        
        .status-data {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 5px;
        }
        
        .status-data-label {
          font-size: 14px;
          color: var(--text);
        }
        
        .status-data-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary);
        }
        
        @media (max-width: 768px) {
          .container {
            width: 95%;
            padding: 20px;
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
        <h1>Server Health</h1>
      </div>
      
      <div class="container">
        <h2>Health Check Dashboard</h2>
        
        <div class="health-status">
          <span class="health-status-icon">${isHealthy ? '✓' : '⚠'}</span>
          <span>System Status: ${isHealthy ? 'HEALTHY' : 'WARNING'}</span>
        </div>
        
        <div class="status-box">
          <div class="status-item">
            <div class="status-item-label">System</div>
            <div class="status-data">
              <div class="status-data-label">Online</div>
              <div class="status-data-value">Uptime: ${uptimeHours}h ${uptimeMinutes}m</div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-item-label">CPU Load</div>
            <div class="progress-container">
              <div class="progress-bar cpu"></div>
            </div>
            <div class="status-data">
              <div class="status-data-label">Current Load</div>
              <div class="status-data-value">${loadAverage.toFixed(2)}%</div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-item-label">Memory Usage</div>
            <div class="progress-container">
              <div class="progress-bar memory"></div>
            </div>
            <div class="status-data">
              <div class="status-data-label">Used / Total</div>
              <div class="status-data-value">${usedMem.toFixed(1)} GB / ${totalMem.toFixed(1)} GB (${memoryPercentage.toFixed(1)}%)</div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-item-label">Last Check</div>
            <div class="status-data">
              <div class="status-data-label">Time</div>
              <div class="status-data-value">${lastCheck}</div>
            </div>
          </div>
        </div>
        
        <div class="button-container">
          <form action="/health" method="get">
            <button type="submit" class="btn-primary">Refresh Health Status</button>
          </form>
          <a href="/" class="btn-secondary">Server Status</a>
        </div>
      </div>
      
      <div class="footer">
        © ${new Date().getFullYear()} Maulik Pankhania. All Rights Reserved.
      </div>
    </body>
  </html>
  `);
};

export default healthCheckUI;
