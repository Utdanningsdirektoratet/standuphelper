param (
  [Parameter(Mandatory = $true)]
  [string]$JiraPassowrd,
  [switch] $skipNpmInstall
)

$ResourceGroupLocation = 'westeurope'
$ResourceGroupName = 'HelpersRG'
$TemplateFileName = 'armtemplate.json'
$linkedTemplateStorage = "hfllinkedtemplates"
$FeedName = "feed"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ErrorActionPreference = "Stop"
$slnLocation = Join-Path $PSScriptRoot "../"

try {
  Set-Location $PSScriptRoot

  $versions = & "$PSScriptRoot/Scripts/initModules.ps1"

  Import-Module Udir.Azure.Arm -RequiredVersion $versions.udirAzureArmVersion -Force
  Import-Module Udir.Azure.Storage -RequiredVersion $versions.udirAzureStorageVersion -Force
  Import-Module Udir.Azure.ResourceGroup -RequiredVersion $versions.udirAzureResourceGroupVersion -Force
  Import-Module Udir.Azure.Dns -RequiredVersion $versions.udirAzureDnsVersion -Force
  Import-Module Udir.Azure.WebApp -RequiredVersion $versions.udirAzureWebAppVersion -Force


  $templateFilePath = Join-Path $PSScriptRoot $TemplateFileName
  $webAppName = "hfl-helpers"
  $dnsName = "helpers"

  $baseDeploymentName = "helpers-$((New-Guid).ToString().SubString(0, 4))"
  Write-Host "Generating SAS token for template storage container: $FeedName"
  $containerSasToken = New-StorageContainerSASToken -AccountName $linkedTemplateStorage -ContainerName $FeedName
  $templateFeed = Get-StorageContainerUrl -AccountName $linkedTemplateStorage -ContainerName $FeedName

  $webAppConfig = @{
    netFrameworkVersion = 'v5.0'
    http20Enabled       = $true
  }

  $deployParams = @{
    webAppName               = $webAppName
    webAppConfig             = $webAppConfig
    containerSasToken        = $containerSasToken
    templateFeed             = $templateFeed
    baseDeploymentName       = $baseDeploymentName
  }

  $DeploymentData = @{
    ResourceGroupLocation      = $ResourceGroupLocation
    ResourceGroupName          = $ResourceGroupName
    TemplateFilePath           = $templateFilePath
    DeployParams               = $deployParams
  }

  Write-Host "==> Ensuring cname for web app $dnsName.udir.tech"
  New-AzureCname -dnsName $dnsName -cname "$webAppName.azurewebsites.net"

  Write-Host "==> Deploying resource group $resourceGroupName in location $ResourceGroupLocation"

  Invoke-AzureResourceGroupDeployment -Name $baseDeploymentName @DeploymentData -Verbose

  Write-Host "==> Building app"

  Set-Location $slnLocation

  dotnet build -c Release

  Set-Location (Join-Path $slnLocation "client")

  if (!$skipNpmInstall) {
    npm ci
  } else {
    Write-Warning "Skipping npm ci"
  }

  npm run prod

  Set-Location $slnLocation
  $randomVersion = [Guid]::NewGuid().ToString().Substring(0,7)
  $publishFolder = (Join-Path $slnLocation "Helpers.Publish")
  $packageName = "Helpers.$randomVersion.zip"
  $packagePath = (Join-Path $slnLocation $packageName)
  dotnet publish -c Release -o $publishFolder

  Compress-Archive -Path "$publishFolder/*" -DestinationPath $packagePath -CompressionLevel Fastest
  Write-Host "Deploying $packagePath to $webAppName"

  $appSettings = Get-WebAppSettings -Name $webAppName -ResourceGroupName $ResourceGroupName
  $appSettings['IdentityProvider__Authority'] = "https://test-hflsso.udir.tech"
  $appSettings['Jira__Username'] = "hfl-hss"
  $appSettings['Jira__Password'] = "$JiraPassowrd"
  $appSettings['Jira__MergeColumnFilter'] = "status='Done' AND (fixVersion in unreleasedVersions() OR (fixVersion in releasedVersions() AND status != Done) OR (fixVersion is EMPTY AND 'Resolution Cause' is EMPTY)) AND issuetype != 'Epic'"

  Write-Host "==> Setting client id and secret for SSO"
  $hflssoVaultName = "test-hflssovault"
  $clientId = "helpers"
  $clientSecret = Get-AzureKeyVaultSecret -VaultName $hflssoVaultName -Name "ConfigStore--ClientSecrets--$clientId" -ErrorAction SilentlyContinue

  if ($null -ne $clientSecret) {
    $appSettings['IdentityProvider__ClientId'] = $clientId
    $appSettings['IdentityProvider__ClientSecret'] = $clientSecret.SecretValueText
  }
  else {
    Write-Warning "Could not fetch client secret for $clientId"
  }

  Write-Host "==> Fetching latest deployment"
  $deployment = Get-LatestARMDeployment -ResourceGroupName $resourceGroupName

  $storageAccountName = $deployment.Outputs.storageAccountName.Value


  $appDeployParams = @{
    WebAppName                      = $webAppName
    PackagePath                     = $packagePath
    AppResourceGroupName            = $ResourceGroupName
    AppSettings                     = $appSettings
    StorageContainerName            = 'deployments'
    StorageBlobName                 = $packageName
    StorageAccountResourceGroupName = $ResourceGroupName
    PackagesStorageAccount          = $storageAccountName
    DeployDirectlyToApp             = $true
  }

  Write-Host "==> Deploying $webAppName"
  Invoke-RunFromPackageDeploy @appDeployParams
} finally {
  Write-Warning "Remember to revert changes to Index.cshtml due to npm run prod (if any)"
  Set-Location $slnLocation
}
