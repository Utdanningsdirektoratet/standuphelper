param(
  [bool]$skipDownload
)

Import-Module PowerShellGet -Force
$versions = @{ }

Write-Host "==> Installing required modules"

function Install-IfNotInstalled {
  param(
    [string]$ModuleName,
    [string]$VersionPattern
  )

  $moduleMaxVersion = (Find-Module $ModuleName -AllVersions | Where-Object { $_.Version -like $VersionPattern } | Select-Object -First 1).Version

  if ($skipDownload) {
    Write-Host "Using module $ModuleName version $moduleMaxVersion without checking if installed"
    return $moduleMaxVersion
  }

  if ($null -eq (Get-Module $ModuleName -ListAvailable | Where-Object { $_.Version -eq $moduleMaxVersion })) {
    Write-Host "==> Installing module $ModuleName version $moduleMaxVersion"
    Install-Module $ModuleName -RequiredVersion $moduleMaxVersion -Force
  }
  else {
    Write-Host "==> Skipping install of module $ModuleName version $moduleMaxVersion because it is already installed"
  }
  return $moduleMaxVersion
}

$udirAzureResourceGroupMaxVersion = Install-IfNotInstalled -ModuleName "Udir.Azure.ResourceGroup" -VersionPattern "1.*" -Verbose
$udirAzureArmMaxVersion = Install-IfNotInstalled -ModuleName "Udir.Azure.Arm" -VersionPattern "1.*" -Verbose
$udirAzureStorageMaxVersion = Install-IfNotInstalled -ModuleName "Udir.Azure.Storage" -VersionPattern "3.*" -Verbose
$udirAzureWebAppMaxVersion = Install-IfNotInstalled -ModuleName "Udir.Azure.WebApp" -VersionPattern "5.*" -Verbose
$udirAzureDnsMaxVersion = Install-IfNotInstalled -ModuleName "Udir.Azure.Dns" -VersionPattern "2.*" -Verbose

$versions.Add('udirAzureResourceGroupVersion', $udirAzureResourceGroupMaxVersion)
$versions.Add('udirAzureArmVersion', $udirAzureArmMaxVersion)
$versions.Add('udirAzureStorageVersion', $udirAzureStorageMaxVersion)
$versions.Add('udirAzureWebAppVersion', $udirAzureWebAppMaxVersion)
$versions.Add('udirAzureDnsVersion', $udirAzureDnsMaxVersion)

Write-Output $versions