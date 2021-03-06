# Helpers (helpers.udir.tech/xhelpers.udir.tech)

Foreløpig er det kun standuphelper som ligger her.

## Kom i gang

* Klon repoet
* `cd client && npm i` deretter `npm start`
* `cd <root> && dotnet restore` eller åpne solutionfila og bygg i Visual Studio

## Publisering

* Tjenesten kjører i testase (App Service Environment), så det er litt problemer knyttet til sertifikater og MTU
* Hvis du ikke har gjort det sett MTU til 1350 (se lenger ned)
* Stå i <client>: `npm run prod`
* Publish fra Visual Studio
* OBS: Hvis det feiler på grunn av `certificate validation error`, gå inn på publish settings, trykk `Validate Connection` så `Save for future...` og `Accept` for å lagre sertifikatet lokalt
* OBS: Fint om du ikke committer før du har kjørt `npm start` igjen slik at script-tagen i Index.cshtml endrer seg tilbake til "dev-mode"

### MTU
Åpne  Powershell som admin:

```
netsh interface ipv4 show subinterface
# Sett alle ethernet eller vEthernet eller whatever som er ditt lokale nettverkskort til mtu 1350:
netsh interface ipv4 set subinterface ethernet mtu=1350 store=persistent
```

## Roadmap

* Antall dager en oppgave har vært i kolonnen. Hent infoen fra Jira (som kompenserer for helger, o.l)
* MVP (released): Vise stories en om gangen med pilnavigering. Enkel visning, med labels, fix-versions, tittel, beskrivelse og bilde
* Fallback når bildet ikke finnes (vise brukernavn) (done - ble tooltip på bildet)
* Kunne navigere med space (kun en vei) (done)
* Overblikk som første bilde (og så drille ned i faser) (done)
* Filtrere bort irrelevante stories. F.eks de med label Reviewed i Peer Review
* Vise irrelevante stories som siste punkt i en fase (i småformat)
* Replace `(/)` med `✔`, `(i)` med `ℹ`, `(x)` med `✘` (done)
