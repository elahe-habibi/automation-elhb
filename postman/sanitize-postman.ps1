param(
    [string]$InputCollection = "Clasooooor-qaqc-elhb.postman_collection.json",
    [string]$InputEnvironment = "dmsss.postman_environment.json",
    [string]$OutputDir = "sanitized"
)

$ErrorActionPreference = "Stop"

$secretKeyPatterns = @(
    'authorization', 'bearer', 'token', 'access_token', 'refresh_token',
    'password', 'passwd', 'pwd', 'api_key', 'apikey', 'api-key', 'client_secret', 'secret',
    'x-api-key', 'key-id', 'keyid', 'private_key', 'auth', 'jwt', 'session', 'cookie'
)

$secretHeaderNames = @(
    'authorization', 'x-api-key', 'api-key', 'x-auth-token', 'x-access-token', 'cookie', 'set-cookie'
)

$redactedValue = 'REDACTED'

function Test-IsSecretKey {
    param([string]$Key)
    if (-not $Key) { return $false }
    $k = $Key.ToLowerInvariant()
    foreach ($p in $secretKeyPatterns) {
        if ($k -like "*${p}*") { return $true }
    }
    return $false
}

function Redact-Value {
    param($Value)
    switch ($Value.GetType().Name) {
        'String' { return $redactedValue }
        'Int32' { return 0 }
        'Int64' { return 0 }
        'Double' { return 0 }
        'Boolean' { return $false }
        default { return $null }
    }
}

function Redact-Object {
    param($Node)

    if ($null -eq $Node) { return $null }

    if ($Node -is [System.Collections.IDictionary]) {
        $out = [ordered]@{}
        foreach ($key in $Node.Keys) {
            $val = $Node[$key]

            if ($key -eq 'auth' -and ($val -is [System.Collections.IDictionary] -or $val -is [System.Collections.IEnumerable])) {
                $out[$key] = Redact-PostmanAuth $val
                continue
            }

            if ($key -eq 'header' -and ($val -is [System.Collections.IEnumerable])) {
                $out[$key] = Redact-PostmanHeaders $val
                continue
            }

            if (Test-IsSecretKey $key) {
                $out[$key] = Redact-Value $val
            } else {
                $out[$key] = Redact-Object $val
            }
        }
        return $out
    }

    if ($Node -is [System.Collections.IEnumerable] -and -not ($Node -is [string])) {
        $arr = @()
        foreach ($it in $Node) { $arr += ,(Redact-Object $it) }
        return $arr
    }

    return $Node
}

function Redact-PostmanHeaders {
    param($Headers)
    $result = @()
    foreach ($h in $Headers) {
        $h2 = $h
        if ($h -is [System.Collections.IDictionary]) {
            $name = ''
            if ($h.Contains('key')) { $name = [string]$h['key'] }
            if (-not $name -and $h.Contains('name')) { $name = [string]$h['name'] }
            if ($name) {
                $lower = $name.ToLowerInvariant()
                if ($secretHeaderNames -contains $lower) {
                    $h2 = [ordered]@{}
                    foreach ($kk in $h.Keys) { $h2[$kk] = $h[$kk] }
                    $h2['value'] = $redactedValue
                }
            }
        }
        $result += ,(Redact-Object $h2)
    }
    return $result
}

function Redact-PostmanAuth {
    param($Auth)
    if ($Auth -is [System.Collections.IEnumerable] -and -not ($Auth -is [string])) {
        $arr = @()
        foreach ($p in $Auth) {
            $p2 = $p
            if ($p -is [System.Collections.IDictionary]) {
                $k = ''
                if ($p.Contains('key')) { $k = [string]$p['key'] }
                if (Test-IsSecretKey $k) {
                    $p2 = [ordered]@{}
                    foreach ($kk in $p.Keys) { $p2[$kk] = $p[$kk] }
                    $p2['value'] = $redactedValue
                }
            }
            $arr += ,(Redact-Object $p2)
        }
        return $arr
    }
    if ($Auth -is [System.Collections.IDictionary]) {
        $out = [ordered]@{}
        foreach ($k in $Auth.Keys) {
            $v = $Auth[$k]
            if (Test-IsSecretKey $k) {
                $out[$k] = Redact-Value $v
            } else {
                $out[$k] = Redact-Object $v
            }
        }
        return $out
    }
    return $Auth
}

function ConvertTo-HashtableRecursively {
    param($Obj)
    if ($null -eq $Obj) { return $null }
    if ($Obj -is [System.Collections.IDictionary]) {
        $ht = [ordered]@{}
        foreach ($k in $Obj.Keys) { $ht[$k] = ConvertTo-HashtableRecursively $Obj[$k] }
        return $ht
    }
    if ($Obj -is [System.Collections.IEnumerable] -and -not ($Obj -is [string])) {
        $arr = @()
        foreach ($x in $Obj) { $arr += ,(ConvertTo-HashtableRecursively $x) }
        return $arr
    }
    if ($Obj -is [pscustomobject]) {
        $ht = [ordered]@{}
        foreach ($p in $Obj.PSObject.Properties) {
            $ht[$p.Name] = ConvertTo-HashtableRecursively $p.Value
        }
        return $ht
    }
    return $Obj
}

function Read-JsonFile {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    $text = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    $obj = $text | ConvertFrom-Json
    return ConvertTo-HashtableRecursively $obj
}

function Write-JsonFile {
    param([Parameter(Mandatory=$true)] [string]$Path, [Parameter(Mandatory=$true)] $Object)
    $json = $Object | ConvertTo-Json -Depth 100
    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    Set-Content -LiteralPath $Path -Value $json -Encoding UTF8
}

$collection = Read-JsonFile $InputCollection
$environment = Read-JsonFile $InputEnvironment

if ($collection) {
    function Scrub-Collection($node) {
        if ($null -eq $node) { return $null }
        if ($node -is [System.Collections.IDictionary]) {
            $out = [ordered]@{}
            foreach ($k in $node.Keys) {
                $v = $node[$k]
                if ($k -eq 'body' -and ($v -is [System.Collections.IDictionary])) {
                    $mode = ''
                    if ($v.Contains('mode')) { $mode = [string]$v['mode'] }
                    if ($mode -eq 'raw' -and $v['raw']) {
                        $v = [ordered]@{}
                        foreach ($kk in $node['body'].Keys) { $v[$kk] = $node['body'][$kk] }
                        $v['raw'] = $redactedValue
                    }
                }
                if ($k -eq 'formdata' -or $k -eq 'urlencoded') {
                    if ($v -is [System.Collections.IEnumerable]) {
                        $tmp = @()
                        foreach ($p in $v) {
                            $p2 = $p
                            if ($p -is [System.Collections.IDictionary]) {
                                $name = ''
                                if ($p.Contains('key')) { $name = [string]$p['key'] }
                                if (Test-IsSecretKey $name) {
                                    $p2 = [ordered]@{}
                                    foreach ($kk in $p.Keys) { $p2[$kk] = $p[$kk] }
                                    $p2['value'] = $redactedValue
                                }
                            }
                            $tmp += ,(Redact-Object $p2)
                        }
                        $out[$k] = $tmp
                        continue
                    }
                }
                $out[$k] = Scrub-Collection $v
            }
            return $out
        }
        if ($node -is [System.Collections.IEnumerable] -and -not ($node -is [string])) {
            $arr = @()
            foreach ($it in $node) { $arr += ,(Scrub-Collection $it) }
            return $arr
        }
        return $node
    }
    $collection = Scrub-Collection $collection
}

if ($environment) {
    if ($environment['values'] -is [System.Collections.IEnumerable]) {
        $newVals = @()
        foreach ($entry in $environment['values']) {
            $entry2 = $entry
            if ($entry -is [System.Collections.IDictionary]) {
                $k = ''
                if ($entry.Contains('key')) { $k = [string]$entry['key'] }
                if (Test-IsSecretKey $k) {
                    $entry2 = [ordered]@{}
                    foreach ($kk in $entry.Keys) { $entry2[$kk] = $entry[$kk] }
                    $entry2['value'] = $redactedValue
                }
            }
            $newVals += ,(Redact-Object $entry2)
        }
        $environment['values'] = $newVals
    }
}

if ($collection) { Write-JsonFile -Path (Join-Path $OutputDir (($InputCollection -replace '\.json$','') + '.sanitized.json')) -Object $collection }
if ($environment) { Write-JsonFile -Path (Join-Path $OutputDir (($InputEnvironment -replace '\.json$','') + '.sanitized.json')) -Object $environment }

Write-Host "Sanitized files written to '$OutputDir'"
