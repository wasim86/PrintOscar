$ErrorActionPreference = "Stop"

$serverName = ".\SQLEXPRESS"
$databaseName = "SegishopDB_Dev"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFileName = "segishop_$timestamp.bak"

# Paths
$projectBackupFolder = Join-Path $PSScriptRoot "db-backup"
$tempBackupFolder = "C:\Temp"
$tempBackupPath = Join-Path $tempBackupFolder $backupFileName
$finalBackupPath = Join-Path $projectBackupFolder $backupFileName

# Ensure directories exist
if (!(Test-Path $projectBackupFolder)) { New-Item -ItemType Directory -Path $projectBackupFolder | Out-Null }
if (!(Test-Path $tempBackupFolder)) { New-Item -ItemType Directory -Path $tempBackupFolder | Out-Null }

Write-Host "Backing up database '$databaseName' to temporary location '$tempBackupPath'..."

$sqlCommand = "BACKUP DATABASE [$databaseName] TO DISK = N'$tempBackupPath' WITH FORMAT, INIT, NAME = N'$databaseName-Full Database Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10"

try {
    # Run sqlcmd and capture output/errors
    $process = Start-Process -FilePath "sqlcmd" -ArgumentList "-S", "$serverName", "-E", "-Q", "`"$sqlCommand`"" -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "SQL Backup command finished successfully." -ForegroundColor Green
        
        # Verify file exists
        if (Test-Path $tempBackupPath) {
            Write-Host "Moving backup file to project folder..."
            Move-Item -Path $tempBackupPath -Destination $finalBackupPath -Force
            Write-Host "Backup successfully saved to: $finalBackupPath" -ForegroundColor Green
        } else {
            Write-Error "Backup file was not found at $tempBackupPath despite successful exit code."
            exit 1
        }
    } else {
        Write-Error "SQL Backup failed with exit code $($process.ExitCode). Check console output for details."
        exit 1
    }
}
catch {
    Write-Error "An unexpected error occurred: $_"
    exit 1
}
