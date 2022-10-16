'use strict';

const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection } = require("@discordjs/voice");

const data =  {
    error: false,
    code: "",
    message: "",
};
_checkUpdate();

exports.lofi = (interaction, options = { voiceChannel, station, selfDeaf, loop, check_radio, volume }) => {
    const { guild } = interaction;
    var { voiceChannel, station, selfDeaf = true, loop = false, check_radio = true, volume } = options;
    if (check_radio) check_radio = (check_radio / 1000);

    if (!interaction) throw new Error("L'argument interaction n'a pas été défini.");
    if (!voiceChannel) { data.error = true; data.code = "VOICE_CHANNEL"; data.message = "Le salon vocal est introuvable."; return data; };
    if (!station) { data.error = true; data.code = "NO_RADIO"; data.message = "La station radio n'a pas été défini."; console.warn("Station radio non fournie. Vous pouvez utilisé une station par défaut via la fonction getStations."); return data; };

    // Connect to voice channel
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: selfDeaf,
    });

    // Début du cooldown. Si avant la fin du cooldown la radio se déconnecte, cela sera considérer comme une radio incorrecte.
    let started = Date.now();

    // Création du player et de la resource
    const player = createAudioPlayer();
    let resource = createAudioResource(station, {
        inlineVolume: true
    });

    // Défini un volume par défaut. (Quand le bot rejoint le salon vocal)
    let default_volume = volume ? (volume / 100, 0.5 / Math.log10(2)) : 1;
    resource.volume.setVolume(default_volume);

    // Lance la radio
    player.play(resource);
    connection.subscribe(player);

    // Déconnexion de la radio
    player.on(AudioPlayerStatus.Idle, () => {
        if (Math.abs(started - Date.now()) < 10000) { data.error = true; data.code = "RADIO_INVALID"; data.message = "La radio s'est déconnecté avant " + check_radio + " secondes"; return data; }

        if (!loop) return;

        // Relance la radio
        let resource = createAudioResource(station, {
            inlineVolume: true,
        });

        player.play(resource);
        connection.subscribe(player);

        return true;
    });

    data.code = "START";
    data.message = "Radio lancée dans le salon " + voiceChannel.name;

    return data;

};

exports.stop = (interaction) => {
    if (!interaction) throw new Error("L'argument interaction est manquante.");

    const connect = getVoiceConnection(interaction.guild.id);
    const bot_voice_channel = interaction.guild.members.me.voice;

    if (!connect) { data.error = true; data.code = "NO_RADIO"; data.message = "Aucune radio ne joue actuellement sur ce serveur."; return data; };

    // Suppression de la radio
    connect.destroy();

    // Déconnexion du salon vocal
    if (bot_voice_channel) bot_voice_channel.disconnect();

    data.code = "STOP";
    data.message = "La radio a bien été stoppée.";
    
    return data;
};

exports.volume = (interaction) => {
    if (!interaction) throw new Error("L'argument interaction est manquante.");

    const connect = getVoiceConnection(interaction.guild.id);

    if (!connect)  { data.error = true; data.code = "NO_RADIO"; data.message = "Aucune radio ne joue actuellement sur ce serveur."; return data; };

    if (!volume || isNaN(volume)) { data.error = true; data.code = "INVALID_VOLUME"; data.message = "Le niveau du volume doit être un nombre"; return data; };

    if (volume > 100 || volume < 0) {  data.error = true; data.code = "INVALID_VOLUME"; data.message = "Le niveau du volume est incorrect. (0 - 100)"; return data; };
    
    // Défini le nouveau volume
    const get_volume = connect.state.subscription.player["_state"]["resource"].volume;
    get_volume.setVolume(volume / 100, 0.5 / Math.log10(2));

    data.code = "SET_VOLUME";
    data.message = `Volume défini sur ${volume}%`;

    return data;
};
/**
 * @param {boolean} random Obtient une station random si défini sur true. Sinon renvoi toutes les stations
 */
exports.getStations = (random = false) => {
    const stations = [
        { name: "anime", link: "http://radio.animenexus.mx:8000/animenexus" },
        { name: "jpop", link: "https://listen.moe/opus" },
        { name: "kpop", link: "https://listen.moe/kpop/opus" },
        { name: "jazz", link: "http://stream.laut.fm/justjazz" },
        { name: "pop", link: "https://streams.ilovemusic.de/iloveradio11.mp3" },
        { name: "lofi", link: "http://stream.laut.fm/lofi" },
    ];

    if (random) { const get_random = stations[Math.floor(Math.random() * stations.length)]; return get_random; }
    else return stations;
};
async function _checkUpdate() {
    if (!require("node-fetch")) return;
    const packageData = await require("node-fetch")(
      `https://registry.npmjs.com/radio-discord.js`
    ).then((text) => text.json());
    if (
      require("../package.json").version !== packageData["dist-tags"].latest
    ) {
        console.log("[radio-discord.js] Une nouvelle version du module est désormais disponible ! \u001b[1;32m npm i radio-discord.js@latest\u001b[0m")
    }
}