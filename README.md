# Helpers (helpers.udir.tech/xhelpers.udir.tech)

Foreløpig er det kun standuphelper som ligger her.

## Kom i gang

* Klon repoet
* `cd client && npm i` deretter `npm start`
* `cd <root> && dotnet restore` eller åpne solutionfila og bygg i Visual Studio
* `dotnet user-secrets set Jira:Password <Passord til hfl-hss-brukeren fra 1pass>`

## Publisering

* Tjenesten kjører på en av test service planene våre og er tilgjengelig på nett. Innlogging med Udir-konto
* Publisering skjer via script i deploy-mappen. 
  * OBSOBS: Funker dessverre foreløpig kun på Windows fra vanlig Powershell. Vil funke x-plat når vi får endret alle Powershellkommandoene våre til å være x-plat (ikke bruke AzureRM)
* Gjør først de endringen du vil og push gjerne på master.
* Kjør scriptet (se på eventuelle parametere du vil gi inn)
* Ta en git reset for å reverte endringen npm run prod gjør i Index.cshtml

## Siden tryner - hva gjør jeg?

Dette er sannsynligvis fordi brukeren hfl-hss må logge inn og oppgi captcha (i know...). Åpne en inkognitofane og gå til https://jira.udir.no/login.jsp?nosso for å logge inn med brukeren.
