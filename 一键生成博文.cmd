@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在读取 posts 文件夹并生成博文...
node scripts\generate-articles.js
if errorlevel 1 (
  echo.
  echo 生成失败，请查看上面的错误信息。
  pause
  exit /b 1
)
echo.
echo 生成完成，正在打开网站首页。
start "" "%CD%\index.html"
timeout /t 3 >nul
