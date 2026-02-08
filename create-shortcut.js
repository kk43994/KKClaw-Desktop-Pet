// 创建桌面快捷方式
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const desktopPath = path.join(process.env.USERPROFILE, 'Desktop');
const shortcutPath = path.join(desktopPath, 'Claw 桌面宠物.lnk');
const projectPath = __dirname;
const iconPath = path.join(projectPath, 'icon.png');

// 使用 PowerShell 创建快捷方式
const psScript = `
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("${shortcutPath.replace(/\\/g, '\\\\')}")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c cd /d \\"${projectPath.replace(/\\/g, '\\\\')}\\" && npm start"
$Shortcut.WorkingDirectory = "${projectPath.replace(/\\/g, '\\\\')}"
$Shortcut.Description = "Claw 桌面宠物 - OpenClaw AI 助手"
$Shortcut.WindowStyle = 7
$Shortcut.Save()
Write-Host "快捷方式已创建: ${shortcutPath}"
`;

console.log('正在创建桌面快捷方式...');

exec(`powershell -Command "${psScript.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, (err, stdout, stderr) => {
    if (err) {
        console.error('创建失败:', err.message);
        console.log('\n手动创建方法:');
        console.log('1. 右键桌面 -> 新建 -> 快捷方式');
        console.log(`2. 位置输入: cmd /c "cd /d "${projectPath}" && npm start"`);
        console.log('3. 名称输入: Claw 桌面宠物');
        return;
    }
    console.log(stdout);
    console.log('✅ 桌面快捷方式创建成功!');
});
