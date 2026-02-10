Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# 截取全屏
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)

# 保存
$outputPath = "C:\Users\zhouk\Desktop\02_开发项目\desktop-pet\docs\images\desktop-view.png"
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "✅ 截图保存: $outputPath"

# 清理
$graphics.Dispose()
$bitmap.Dispose()
