const { EmbedBuilder } = require("@discordjs/builders");
const translate = require("@iamtraction/google-translate");
const { SlashCommandBuilder } = require("discord.js");

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Music commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("play a song")
        .addStringOption((option) =>
          option.setName("song").setDescription("song name").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("stop the music")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("queue").setDescription("show the music queue")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("skip").setDescription("skip the current song")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("pause").setDescription("pause the music")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("resume").setDescription("resume the music")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("remove a song from the queue")
        .addIntegerOption((option) =>
          option.setName("song").setDescription("song number").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("set the volume of the music")
        .addIntegerOption((option) =>
          option
            .setName("volume")
            .setDescription("volume")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(100)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("shuffle").setDescription("shuffle the queue")
    ),
  async execute(client, interaction, db, lang) {
    if (!interaction.member.voice.channelId)
      return await translate(
        `🔮🧙🏻‍♂️***You need to be in a voice channel to use this command***`,
        { to: lang }
      ).then((res) =>
        interaction.reply({ content: res.text})
      );
    switch (interaction.options.getSubcommand()) {
      case "play":
        await interaction.deferReply();
        const resolve = await client.poru.resolve({
          query: interaction.options.getString("song"),
          source: "ytmsearch",
          requester: interaction.member,
        });
        if (resolve.loadType === "error") {
          return interaction.editReply("Failed to load track.");
        } else if (resolve.loadType === "empty") {
          return interaction.editReply("No source found!");
        }

        const player = await client.poru.createConnection({
          guildId: interaction.guildId,
          voiceChannel: interaction.member.voice.channelId,
          textChannel: interaction.channel.id,
          deaf: true,
        });

        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === "playlist") {
          for (const track of tracks) {
            track.info.requester = interaction.member;
            player.queue.add(track);
          }
          const totalDuration = tracks.reduce(
            (acc, track) => acc + track.info.length,
            0
          );

          let title = await translate(`***Added Playlist to queue***`, {
            to: lang,
          });
          let field1 = await translate(`Total Duration`, { to: lang });
          let field2 = await translate(`Requested by`, { to: lang });
          let description = await translate(
            `🔮🧙🏻‍♂️***Added ${tracks.length} songs in queue***`,
            { to: lang }
          );

          const embed = new EmbedBuilder()
            .setColor(0x6937c1)
            .setTitle(title.text)
            .setURL(playlistInfo.uri)
            .setDescription(
              `**__${playlistInfo.name}__ Playlist** ${description.text}`
            )
            .addFields(
              {
                name: field1.text,
                value: formatTime(totalDuration),
                inline: true,
              },
              {
                name: field2.text,
                value: `<@${interaction.user.id}>`,
                inline: true,
              }
            )
            .setImage(
              tracks[0].info.artworkUrl ||
                "https://images.vexels.com/media/users/3/131549/isolated/preview/90d83e106c1c76aff84c6c6fb88892db-icono-de-nota-musical-plana.png"
            )
            .setFooter({
              text: `Songs in queue: ${player.queue.size}\nWitcherBot | ®️ Right reserved for KraunDew 2025`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
          if (!player.isPlaying && !player.isPaused) return player.play(tracks[0]);
        } else {
          const track = tracks.shift();
          track.info.requester = interaction.member;
          player.queue.add(track);
          let title = await translate(`***Added Song to queue***`, {
            to: lang,
          });
          let description = await translate(`🔮🧙🏻‍♂️Added song to the queue`, {
            to: lang,
          });
          let field1 = await translate(`Duration`, { to: lang });
          let field2 = await translate(`Author`, { to: lang });
          let field3 = await translate(`Requested by`, { to: lang });

          const embed = new EmbedBuilder()
            .setColor(0x6937c1)
            .setTitle(title.text)
            .setURL(track.info.uri)
            .setDescription(`**__${track.info.title}__** ${description.text}`)
            .addFields(
              {
                name: field1.text,
                value: formatTime(track.info.length),
                inline: true,
              },
              { name: field2.text, value: track.info.author, inline: true },
              {
                name: field3.text,
                value: `<@${interaction.user.id}>`,
                inline: true,
              }
            )
            .setImage(
              track.info.artworkUrl ||
                "https://images.vexels.com/media/users/3/131549/isolated/preview/90d83e106c1c76aff84c6c6fb88892db-icono-de-nota-musical-plana.png"
            )
            .setFooter({
              text: `Songs in queue: ${player.queue.size}\nWitcherBot | ®️ Right reserved for KraunDew 2025`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          await interaction.editReply({ embeds: [embed] });
          if (!player.isPlaying && !player.isPaused) return player.play(track);
        }
        break;
      case "stop":
        let player_stop = client.poru.players.get(interaction.guildId);

        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) =>
            interaction.editReply({ content: res.text, ephemeral: true })
          );
        if (!player_stop)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        await interaction.deferReply();
        let title = await translate(`🛑***Music stopped***`, { to: lang });
        let description = await translate(
          `🔮🧙🏻‍♂️ ***The music has been successfully stopped.\nthe bot will leave the voice channel to rest its magical ears.***`,
          { to: lang }
        );
        const StopEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setTitle(title.text)
          .setDescription(description.text)
          .addFields(
            {
              name: (await translate("Player status", { to: lang })).text,
              value: (
                await translate(
                  "The queue has been deleted and the connection closed.",
                  { to: lang }
                )
              ).text,
              inline: true,
            },
            {
              name: (await translate("Whats next?", { to: lang })).text,
              value: (
                await translate(
                  "You can use `/music play` to play another song.",
                  { to: lang }
                )
              ).text,
              inline: true,
            }
          )
          .setFooter({
            text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        await interaction.editReply({ embeds: [StopEmbed] });
        player_stop.destroy();
        break;

      case "queue":
        let player_queue = client.poru.players.get(interaction.guildId);

        await interaction.deferReply();

        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) =>
            interaction.editReply({ content: res.text, ephemeral: true })
          );
        if (!player_queue)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        if (!player_queue.queue.length)
          return await translate(`🔮🧙🏻‍♂️***The queue is empty***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));

        const queue =
          player_queue.queue.length > 9
            ? player_queue.queue.slice(0, 9)
            : player_queue.queue;

        let queue_title = await translate(`🧙🏻‍♂️🎶***Music Queue***`, {
          to: lang,
        });

        const queueEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setTitle(queue_title.text)
          .setDescription(
            `[${player_queue.currentTrack.info.title}](${
              player_queue.currentTrack.info.uri
            }) [${formatTime(player_queue.currentTrack.info.length)}]`
          )
          .setFooter({
            text: `Songs in queue: ${player_queue.queue.size}\nWitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        if (queue.length)
          queueEmbed.addFields({
            name: (await translate("Up Next", { to: lang })).text,
            value: queue
              .map(
                (track, index) =>
                  `**${index + 1}.** [${track.info.title}](${track.info.uri})`
              )
              .join("\n"),
            inline: true,
          });
        if (queue[0]) queueEmbed.setImage(queue[0].info.artworkUrl);

        await interaction.editReply({ embeds: [queueEmbed] });

        break;
      case "skip":
        let player_skip = client.poru.players.get(interaction.guildId);
        await interaction.deferReply();
        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) =>
            interaction.editReply({ content: res.text, ephemeral: true })
          );
        if (!player_skip)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));

        if (interaction.user.id !== player_skip.currentTrack.info.requester.id)
          return await translate(
            `🔮🧙🏻‍♂️***You are not allowed to use this command now as the song is not requested by you***`,
            { to: lang }
          ).then((res) => interaction.editReply({ content: res.text }));
        if (!player_skip.queue.length)
          return await translate(`🔮🧙🏻‍♂️***The queue is empty***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        player_skip.skip();
        let track = player_skip.queue[0];
        let field1 = await translate(`Duration`, { to: lang });
        let field2 = await translate(`Author`, { to: lang });
        let field3 = await translate(`Requested by`, { to: lang });

        const skikpEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setFooter({
            text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setTitle((await translate("🧙🏻‍♂️🔮 Song skipped", { to: lang })).text)
          .setURL(track.info.uri)
          .setDescription(
            `${
              (await translate("Now playing the song:", { to: lang })).text
            } **__${track.info.title}__**`
          )
          .addFields(
            {
              name: field1.text,
              value: formatTime(track.info.length),
              inline: true,
            },
            { name: field2.text, value: track.info.author, inline: true },
            {
              name: field3.text,
              value: `<@${interaction.user.id}>`,
              inline: true,
            }
          )
          .setImage(
            track.info.artworkUrl ||
              "https://images.vexels.com/media/users/3/131549/isolated/preview/90d83e106c1c76aff84c6c6fb88892db-icono-de-nota-musical-plana.png"
          );

        await interaction.editReply({ embeds: [skikpEmbed] });
        break;
      case "pause":
        let player_pause = client.poru.players.get(interaction.guildId);
        await interaction.deferReply();

        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) =>
            interaction.editReply({ content: res.text, ephemeral: true })
          );
        if (interaction.user.id !== player_pause.currentTrack.info.requester.id)
          return await translate(
            `🔮🧙🏻‍♂️***You are not allowed to use this command now as the song is not requested by you***`,
            { to: lang }
          ).then((res) => interaction.editReply({ content: res.text }));
        if (!player_pause)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        if (player_pause.isPaused) {
          let pauseEmbed = new EmbedBuilder()
            .setColor(0x6937c1)
            .setTitle(
              (await translate("Music is already paused", { to: lang })).text
            )
            .setFooter({
              text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();
          return await interaction.editReply({ embeds: [pauseEmbed] });
        }

        player_pause.pause(true);

        let pauseEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setTitle(
            (await translate("Music has been paused", { to: lang })).text
          )
          .setFooter({
            text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();
        await interaction.editReply({ embeds: [pauseEmbed] });
        break;
      case "resume":
        let player_resume = client.poru.players.get(interaction.guildId);
        await interaction.deferReply();

        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) =>
            interaction.editReply({ content: res.text, ephemeral: true })
          );
        if (
          interaction.user.id !== player_resume.currentTrack.info.requester.id
        )
          return await translate(
            `🔮🧙🏻‍♂️***You are not allowed to use this command now as the song is not requested by you***`,
            { to: lang }
          ).then((res) => interaction.editReply({ content: res.text }));
        if (!player_resume)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));

        if (!player_resume.isPaused) {
          const resumeEmbed = new EmbedBuilder()
            .setColor(0x6937c1)
            .setTitle(
              (await translate("Music is already playing", { to: lang })).text
            )
            .setFooter({
              text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();
          return await interaction.editReply({ embeds: [resumeEmbed] });
        } else {
          player_resume.pause(false);
          const resumeEmbed = new EmbedBuilder()
            .setColor(0x6937c1)
            .setTitle(
              (await translate("Music has been resumed", { to: lang })).text
            )
            .setFooter({
              text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();
          await interaction.editReply({ embeds: [resumeEmbed] });
        }

        break;
      case "remove":
        let player_remove = client.poru.players.get(interaction.guildId);
        const track_remove = interaction.options.getInteger("song");
        await interaction.deferReply();
        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) => interaction.editReply({content: res.text}));
        if (!player_remove)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        if (!interaction.member.permissions.has("Administrator"))
          return await translate(
            `🔮🧙🏻‍♂️***You need to be an administrator to use this command***`,
            { to: lang }
          ).then((res) => interaction.editReply({ content: res.text }));
        if (track_remove > player_remove.queue.length)
          return await translate(`🔮🧙🏻‍♂️***Track not found in the queue**`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));

        const removeEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setTitle(
            (await translate("Song removed from the queue", { to: lang })).text
          )
          .setDescription(
            `**__${player_remove.queue[track_remove - 1].info.title}__**`
          )
          .addFields(
            {
              name: (await translate("Duration", { to: lang })).text,
              value: formatTime(
                player_remove.queue[track_remove - 1].info.length
              ),
              inline: true,
            },
            {
              name: (await translate("Author", { to: lang })).text,
              value: player_remove.queue[track_remove - 1].info.author,
              inline: true,
            },
            {
              name: (await translate("Requested by", { to: lang })).text,
              value: `<@${interaction.user.id}>`,
              inline: true,
            }
          )
          .setImage(player_remove.queue[track_remove - 1].info.artworkUrl)
          .setFooter({
            text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        await interaction.editReply({ embeds: [removeEmbed] });
        player_remove.queue.remove(track_remove - 1);
        break;
      case "volume":
        let player_volume = client.poru.players.get(interaction.guildId);
        const volume = interaction.options.getInteger("volume");
        await interaction.deferReply();
        if (volume > 100 || volume < 0)
          return await translate(`🔮🧙🏻‍♂️***Volume must be between 0 and 100***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        if (
          interaction.user.id !== player_volume.currentTrack.info.requester.id
        )
          return await translate(
            `🔮🧙🏻‍♂️***You are not allowed to use this command now as the song is not requested by you***`,
            { to: lang }
          ).then((res) => interaction.editReply({ content: res.text }));
        if (
          interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
        )
          return await translate(
            `🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`,
            { to: lang }
          ).then((res) =>
            interaction.editReply({ content: res.text, ephemeral: true })
          );
        if (!player_volume)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, {
            to: lang,
          }).then((res) => interaction.editReply({ content: res.text }));
        const caracteresLLenos = Math.floor((volume/100)*20);
        const caracteresVacios = 20-caracteresLLenos;
        const barra = '['+'█'.repeat(caracteresLLenos)+'░'.repeat(caracteresVacios)+']';
        const volumeEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setTitle((await translate("Volume changed", { to: lang })).text)
          .setDescription(`**${barra}__${volume}%__**`)
          .setFooter({
            text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        await interaction.editReply({ embeds: [volumeEmbed] });
        player_volume.setVolume(volume);

        break;
      case 'shuffle':
        let player_shuffle = client.poru.players.get(interaction.guildId);
        await interaction.deferReply();
        
        if(interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId)
          return await translate(`🔮🧙🏻‍♂️***You need to be in the same voice channel to use this command***`, { to: lang }).then(res => interaction.editReply({ content: res.text, ephemeral: true }));
        if(!player_shuffle)
          return await translate(`🔮🧙🏻‍♂️***No music is playing***`, { to: lang }).then(res => interaction.editReply({ content: res.text }))
        if(!player_shuffle.queue.length)
          return await translate(`🔮🧙🏻‍♂️***The queue is empty***`, { to: lang }).then(res => interaction.editReply({ content: res.text }))
        if(!interaction.member.permissions.has('Administrator'))
          return await translate(`🔮🧙🏻‍♂️***You need to be an administrator to use this command***`, { to: lang }).then(res => interaction.editReply({ content: res.text }))
        if(player_shuffle.queue.length <= 2)
          return await translate(`🔮🧙🏻‍♂️***The queue is already shuffled***`, { to: lang }).then(res => interaction.editReply({ content: res.text }))

        player_shuffle.queue.shuffle();
        const shuffleEmbed = new EmbedBuilder()
          .setColor(0x6937c1)
          .setTitle((await translate("Queue shuffled", { to: lang })).text)
          .setDescription((await translate("The queue has been shuffled", { to: lang })).text)
          .addFields(
            {
              name: (await translate("Up Next", { to: lang })).text,
              value: player_shuffle.queue[0].info.title,
              inline: true
            },
            {
              name: (await translate("Duration", { to: lang })).text,
              value: formatTime(player_shuffle.queue[0].info.length),
              inline: true
            },
            {
              name: (await translate("Author", { to: lang })).text,
              value: player_shuffle.queue[0].info.author,
              inline: true
            }
          )
          .setImage(player_shuffle.queue[0].info.artworkUrl)
          .setFooter({
            text: `WitcherBot | ®️ Right reserved for KraunDew 2025`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        await interaction.editReply({ embeds: [shuffleEmbed] });

        break;
      default:
        break;
    }
  },
};
