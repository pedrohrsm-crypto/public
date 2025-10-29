# Script para criar backup das páginas HTML
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$sourcePath = "D:\GitHub\HTML\projeto-frontend\ONGConnect\public\pages"
$backupDir = "D:\GitHub\HTML\projeto-frontend\ONGConnect\public\pages\backup"
$zipName = "pages-backup-$timestamp.zip"
$zipPath = Join-Path $backupDir $zipName

Write-Host "`n=== CRIANDO BACKUP DAS PÁGINAS HTML ===" -ForegroundColor Cyan
Write-Host "Data/Hora: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor White
Write-Host "Diretório origem: $sourcePath" -ForegroundColor White
Write-Host "Arquivo backup: $zipName" -ForegroundColor White

try {
    # Verificar se o diretório de backup existe
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Write-Host "Diretório de backup criado" -ForegroundColor Green
    }

    # Listar arquivos HTML para backup
    $htmlFiles = Get-ChildItem -Path $sourcePath -Filter "*.html" -File
    Write-Host "`nArquivos HTML encontrados:" -ForegroundColor Yellow
    foreach ($file in $htmlFiles) {
        Write-Host "  • $($file.Name) ($([math]::Round($file.Length/1KB, 2)) KB)" -ForegroundColor Gray
    }

    # Criar arquivo ZIP
    Write-Host "`nCriando arquivo ZIP..." -ForegroundColor Yellow
    
    # Usar Compress-Archive para criar o backup
    $filesToBackup = Get-ChildItem -Path $sourcePath -Filter "*.html" -File | ForEach-Object { $_.FullName }
    
    if ($filesToBackup.Count -gt 0) {
        Compress-Archive -Path $filesToBackup -DestinationPath $zipPath -Force
        
        # Verificar se o arquivo foi criado
        if (Test-Path $zipPath) {
            $zipSize = Get-Item $zipPath
            Write-Host "`n✅ BACKUP CRIADO COM SUCESSO!" -ForegroundColor Green
            Write-Host "Arquivo: $zipName" -ForegroundColor Green
            Write-Host "Tamanho: $([math]::Round($zipSize.Length/1KB, 2)) KB" -ForegroundColor Green
            Write-Host "Localização: $zipPath" -ForegroundColor Green
            Write-Host "Arquivos incluídos: $($filesToBackup.Count) páginas HTML" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro: Arquivo ZIP não foi criado" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Nenhum arquivo HTML encontrado para backup" -ForegroundColor Red
    }

} catch {
    Write-Host "❌ Erro ao criar backup: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== BACKUP CONCLUÍDO ===" -ForegroundColor Cyan