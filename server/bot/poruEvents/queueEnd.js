const translate = require("@iamtraction/google-translate");
const { EmbedBuilder } = require("discord.js");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

module.exports.execute = async (client, player) => {
  const lastTrack = player.previousTrack;
  const lastRequester = lastTrack.info.requester;
  if (!lastTrack) return;
  const query = `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`;

  const result = await client.poru.resolve({
    query,
    source: "ytmsearch",
    requester: lastRequester || client.user,
  });

  if (!result || !result.tracks.length) return;

  const nextTrack = result.tracks.find((t) => t.info.identifier !== lastTrack.info.identifier) || result.tracks[0];
  nextTrack.info.requester = lastRequester || client.user;
  player.queue.add(nextTrack);
  player.play();

  const channel = client.channels.cache.get(player.textChannel);
  const lang = await (client.db).data().lang;
  let title = await translate(`***Una sugerencia magica***`, {
    to: lang,
  });
  let description = await translate(`🔮🧙🏻‍♂️Canción añadida por mi magia`, {
    to: lang,
  });
  let field1 = await translate(`Duration`, { to: lang });
  let field2 = await translate(`Author`, { to: lang });
  let field3 = await translate(`Requested by`, { to: lang });

  const embed = new EmbedBuilder()
    .setColor(0x6937c1)
    .setTitle(title.text)
    .setURL(nextTrack.info.uri)
    .setDescription(`**__${nextTrack.info.title}__** ${description.text}`)
    .addFields(
      {
        name: field1.text,
        value: formatTime(nextTrack.info.length),
        inline: true,
      },
      { name: field2.text, value: nextTrack.info.author, inline: true },
      {
        name: field3.text,
        value: `<@${nextTrack.info.requester.id}>`,
        inline: true,
      }
    )
    .setImage(
      nextTrack.info.artworkUrl ||
        "https://images.vexels.com/media/users/3/131549/isolated/preview/90d83e106c1c76aff84c6c6fb88892db-icono-de-nota-musical-plana.png"
    )
    .setFooter({
      text: `Songs in queue: ${player.queue.size}\nWitcherBot | ®️ Right reserved for KraunDew 2025`,
      iconURL: client.user.displayAvatarURL(),
    })
    .setTimestamp();
  await channel.send({ embeds: [embed] });
};
