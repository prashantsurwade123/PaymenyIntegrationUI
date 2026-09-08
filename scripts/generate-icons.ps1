Add-Type -AssemblyName System.Drawing
$iconRoot = Join-Path $PSScriptRoot '../public/icons'
New-Item -ItemType Directory -Force -Path $iconRoot | Out-Null
foreach ($iconSpec in @(@('icon-192.png', 192), @('icon-512.png', 512), @('maskable-512.png', 512), @('apple-touch-icon.png', 180))) {
    $size = [int]$iconSpec[1]
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $drawing = [System.Drawing.Graphics]::FromImage($bitmap)
    $drawing.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $drawing.Clear([System.Drawing.ColorTranslator]::FromHtml('#2E1C10'))
    $orange = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#E56C16'))
    $gold = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#D9A441'), ($size * 0.012))
    $cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FBF7F0'))
    $drawing.DrawEllipse($gold, [single]($size * 0.19), [single]($size * 0.19), [single]($size * 0.62), [single]($size * 0.62))
    # A simple fort-and-flag mark, kept inside the maskable safe zone.
    $drawing.FillRectangle($cream, [single]($size * 0.31), [single]($size * 0.48), [single]($size * 0.38), [single]($size * 0.19))
    foreach ($x in @(0.31, 0.465, 0.62)) { $drawing.FillRectangle($cream, [single]($size * $x), [single]($size * 0.43), [single]($size * 0.07), [single]($size * 0.08)) }
    $drawing.FillRectangle($orange, [single]($size * 0.48), [single]($size * 0.28), [single]($size * 0.02), [single]($size * 0.17))
    $flag = [System.Drawing.PointF[]]@([System.Drawing.PointF]::new($size * 0.50, $size * 0.28), [System.Drawing.PointF]::new($size * 0.67, $size * 0.32), [System.Drawing.PointF]::new($size * 0.50, $size * 0.38))
    $drawing.FillPolygon($orange, $flag)
    $drawing.FillRectangle($orange, [single]($size * 0.465), [single]($size * 0.55), [single]($size * 0.07), [single]($size * 0.12))
    $bitmap.Save((Join-Path $iconRoot $iconSpec[0]), [System.Drawing.Imaging.ImageFormat]::Png)
    $cream.Dispose(); $gold.Dispose(); $orange.Dispose(); $drawing.Dispose(); $bitmap.Dispose()
}
