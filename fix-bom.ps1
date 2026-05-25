$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$files = @(
  ".\src\pages\admin\AdminCourses.jsx",
  ".\src\pages\admin\courses\AdminCourses.jsx",
  ".\src\pages\admin\courses\CourseInfoForm.jsx",
  ".\src\pages\admin\courses\CourseList.jsx",
  ".\src\pages\admin\courses\CourseStats.jsx",
  ".\src\pages\admin\courses\LessonBuilder.jsx",
  ".\src\pages\admin\courses\QuizBuilder.jsx",
  ".\src\pages\admin\courses\courseBuilderUtils.js"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    [System.IO.File]::WriteAllText((Resolve-Path $file), $content, $utf8NoBom)
    Write-Host "Fixed BOM: $file"
  } else {
    Write-Host "Missing: $file"
  }
}

$content = 'export { default } from "./courses/AdminCourses";'
[System.IO.File]::WriteAllText((Resolve-Path ".\src\pages\admin\AdminCourses.jsx"), $content, $utf8NoBom)

Write-Host "Done."
