radio-discord.js
==========
Un module qui vous permet de jouer une `station radio` via `@discordjs/voice`.


Installation
------------

Install with `npm`:

``` bash
$ npm install radio-discord.js
```

Stations
--------

Des stations sont a votre disposition. Il vous suffit d'utiliser la fonction `getStations` qui vous reverra un `Object - { name: "nom de la station", link: "lien de la station" }`

Vous pouvez obtenir une station random en ajoutant `true` en tant que paramètre de la fonction `getStations`, pour obtenir une station radio aléatoire.
Par défaut, toutes les stations sont renvoyées.

# Stations :
 * Pop
 * Jazz
 * Lofi
 * Jpop
 * Kpop
 * Anime

## Exemple d'utilisation
```js
const radio_discord = require("radio-discord.js");
const radio = radio_discord.getStations();

console.log(radio);
```

Lofi
----

La fonction `lofi` vous permet de lancer une radio dans un salon vocal.

#### Paramètres :
* interaction - Discord interaction / message
* voiceChannel - Salon vocal
* station - Lien de la station radio
* selfDeaf - Bot en sourdine <true | false>
* loop - Reconnecte la radio automatiquement s'il se déconnecte <true | false>
* check_radio - Si la radio se déconnecte dans ce délai, alors le lien radio sera considéré comme invalide. `temps en seconde`
* volume - Volume par défaut. (Quand le bot rejoint le salon vocal)

# Exemple d'utilisation
```js
const radio_discord = require("radio-discord.js");
const radio = radio_discord.getStations(true);
const voiceChannel = message.member.voice.channel;

const start = radio_discord.lofi(interaction, { voiceChannel: voiceChannel, station: radio.link, selfDeaf: true, loop: true, check_radio: 10, volume: 70 });

console.log(start);
```

volume
------

Permet de modifier le volume.

#### Paramètres :
* interaction - Discord interaction - message
* volume - Le niveau du volume. <number>

# Exemple d'utilisation
```js
const radio_discord = require("radio-discord.js");
const volume = args[0];

radio_discord.volume(interaction, Number(volume));
```

stop
----

Permet de stopper la radio.

#### Paramètres
* interaction - Discord interaction / message

# Exemple d'utilisation
```js
const radio_discord = require("radio-discord.js");
const stop = radio_discord.stop(interaction);

console.log(stop);
```

**En cas de problème :**
* Discord: Zeleff_#1615
