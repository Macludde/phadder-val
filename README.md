# Vad är detta

För att underlätta phaddervalet 2024 tog jag hjälp av en dator.

## Hur fungerar det

1. Läs in phaddrar från formulär till databasen
2. Städa upp manuell input (tider folk inte kan, vem de vill vara phadder med osv)
3. Generera mötestider automatiskt
4. Skicka ut personligt mail
5. Generera anteckningsdokument
6. (_håll i intervjuer_)
7. Mata in intervjuresultat
8. Generera bilder

**NOTERING**: Detta byggdes jättehårdkodat för 2024, det var inte tanken att användas senare. Jag har skrivit om kod medan jag satt och använde verktyget, det är inte omöjligt att du behöver göra detsamma!

## Kom igång

Du behöver `Node`, ladda sedan ner `pnpm` genom `npm install -g pnpm`.

När du har skapat ett projekt och installerat beroenden med `pnpm install`, starta en utvecklingsserver:

```bash
pnpm run dev
```

## Bygg mer saker

Jag har använt `https://www.shadcn-svelte.com/` för komponenter. Som du ser när du kör projektet har jag inte brytt mig om design för fem öre, det är ren funktionalitet.

### Tech stack

- `TypeScript` (huvudspråk)
- `Svelte` + `SvelteKit` (rendering)
- `PostgreSQL` och `Prisma` (databas)
