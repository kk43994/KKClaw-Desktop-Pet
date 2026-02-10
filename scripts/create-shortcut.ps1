$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Claw 桌面宠物.lnk")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = '/c cd /d "C:\Users\zhouk\Desktop\02_开发项目\desktop-pet" && npm start'
$Shortcut.WorkingDirectory = "C:\Users\zhouk\Desktop\02_开发项目\desktop-pet"
$Shortcut.Description = "Claw 桌面宠物 - OpenClaw AI 助手"
$Shortcut.WindowStyle = 7
$Shortcut.Save()
Write-Host "快捷方式已创建!"
