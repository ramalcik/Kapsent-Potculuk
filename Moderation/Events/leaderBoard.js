const client = global.client;
const StatDatabase = require("../Models/Stat");
const Database = require("../Models/Yetkili");
const InviteDatabase = require("../Models/Invite");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const SetupDatabase = require("../Models/Setup")

module.exports = async () => {

  const res = await SetupDatabase.findOne({})
  let guildID = res && res.guildID ? res.guildID : ""
  if (guildID === "") return
  const doc = await SetupDatabase.findOne({guildID: guildID})
  let guildName = doc && doc.guildName ? doc.guildName : "Challenger"
  let chatStatsLeaderBoardMessageID = res && res.chatStatsLeaderBoardMessageID ? res.chatStatsLeaderBoardMessageID : ""
  let voiceStatsLeaderBoardMessageID = res && res.voiceStatsLeaderBoardMessageID ? res.voiceStatsLeaderBoardMessageID : ""
  let taggedStatsLeaderBoardMessageID = res && res.taggedStatsLeaderBoardMessageID ? res.taggedStatsLeaderBoardMessageID : ""
  let inviteStatsLeaderBoardMessageID = res && res.inviteStatsLeaderBoardMessageID ? res.inviteStatsLeaderBoardMessageID : ""
  let registerStatsLeaderBoardMessageID = res && res.registerStatsLeaderBoardMessageID ? res.registerStatsLeaderBoardMessageID : ""
  let leaderBoard = res && res.leaderBoard ? res.leaderBoard : ""
  if (leaderBoard === "" || chatStatsLeaderBoardMessageID === "" || voiceStatsLeaderBoardMessageID === "" || taggedStatsLeaderBoardMessageID === "" || inviteStatsLeaderBoardMessageID === "" || registerStatsLeaderBoardMessageID === "") return
  let chatMsg = await client.guilds.cache.get(guildID).channels.cache.get(leaderBoard).messages.fetch(chatStatsLeaderBoardMessageID);
  let voiceMsg = await client.guilds.cache.get(guildID).channels.cache.get(leaderBoard).messages.fetch(voiceStatsLeaderBoardMessageID);
  let taggedMsg = await client.guilds.cache.get(guildID).channels.cache.get(leaderBoard).messages.fetch(taggedStatsLeaderBoardMessageID);
  let inviteMsg = await client.guilds.cache.get(guildID).channels.cache.get(leaderBoard).messages.fetch(inviteStatsLeaderBoardMessageID);
  let registerMsg = await client.guilds.cache.get(guildID).channels.cache.get(leaderBoard).messages.fetch(registerStatsLeaderBoardMessageID);

  let intervalCount = 1800000 //1800000
  
  setInterval(() => {
  checkChat()
  }, intervalCount)
  
  setInterval(() => {
  checkVoice()
  }, intervalCount)
  
  setInterval(() => {
  checkTagged()
  }, intervalCount)
  
  setInterval(() => {
  checkInvite()
  }, intervalCount)

  setInterval(() => {
  checkRegister()
  }, intervalCount)

  function checkChat() { 
  StatDatabase.find({ SunucuID: guildID }, async (err, res) => {
  res = res.filter(x => client.guilds.cache.get(guildID).members.cache.get(x.userID));
  const msgList = res.filter(x => x && x.MessageNumber !== 0).sort((x, y) => y.MessageNumber - x.MessageNumber).map((val, i) =>`\`${i + 1}.\` ${client.guilds.cache.get(guildID).members.cache.get(val.userID)}: ${val.MessageNumber} Mesaj`).splice(0, 30).join("\n");
  let chat = new MessageEmbed()
  chat.setColor("BLACK")
  chat.setAuthor(`${guildName} Mesaj S??ralamas?? | T??m Zamanlar`, client.guilds.cache.get(guildID).iconURL({dynamic:true}))
  chat.setFooter(`G??ncellenme: ${moment(Date.now()).locale("TR").format("LLL")}`)
  chat.setDescription(`${msgList.length === 0 ? `Veritaban??nda kay??tl?? mesaj verisi yok bu y??zden bilgileri g??steremiyorum.` : msgList}` )
  chatMsg.edit(chat)})}
  
  function checkVoice() {  
   StatDatabase.find({ SunucuID: guildID }, async (err, res) => {
  res = res.filter(x => client.guilds.cache.get(guildID).members.cache.get(x.userID));
  const voiceList = res.filter(x => x && x.VoiceNumber !== 0).sort((x, y) => y.VoiceNumber - x.VoiceNumber).map((val, i) =>`\`${i + 1}.\` ${client.guilds.cache.get(guildID).members.cache.get(val.userID)}: ${client.parseTime(val.VoiceNumber)}`).splice(0, 30).join("\n");
  let voice = new MessageEmbed()
  voice.setColor("BLACK")
  voice.setAuthor(`${guildName} Ses S??ralamas?? | T??m Zamanlar`, client.guilds.cache.get(guildID).iconURL({dynamic:true}))
  voice.setFooter(`G??ncellenme: ${moment(Date.now()).locale("TR").format("LLL")}`)
  voice.setDescription(`${voiceList.length === 0 ? `Veritaban??nda kay??tl?? ses verisi yok bu y??zden bilgileri g??steremiyorum.` : voiceList}` )
  voiceMsg.edit(voice);})}
  
  function checkTagged() {  
   Database.find({ guildID: guildID }, async (err, res) => {
  res = res.filter(x => client.guilds.cache.get(guildID).members.cache.get(x.userID));
  const voiceList = res.filter(x => x && x.tagald??total !== 0).sort((x, y) => y.tagald??total - x.tagald??total).map((val, i) =>`\`${i + 1}.\` ${client.guilds.cache.get(guildID).members.cache.get(val.userID)}: Toplamda **${val.tagald??total}** ??yeye tag ald??rm????.`).splice(0, 30).join("\n");
  let voice = new MessageEmbed()
  voice.setColor("BLACK")
  voice.setAuthor(`${guildName} Tag Ald??rma S??ralamas?? | T??m Zamanlar`, client.guilds.cache.get(guildID).iconURL({dynamic:true}))
  voice.setFooter(`G??ncellenme: ${moment(Date.now()).locale("TR").format("LLL")}`)
  voice.setDescription(`${voiceList.length === 0 ? `Veritaban??nda kay??tl?? tag ald??rma verisi yok bu y??zden bilgileri g??steremiyorum.` : voiceList}` )
  taggedMsg.edit(voice);})}
  
  function checkInvite() {  
   InviteDatabase.find({ guildID: guildID }, async (err, res) => {
  res = res.filter(x => client.guilds.cache.get(guildID).members.cache.get(x.userID));
  const inviteList = res.filter(x => x && x.total !== 0).sort((x, y) => y.total - x.total).map((val, i) =>`\`${i + 1}.\` ${client.guilds.cache.get(guildID).members.cache.get(val.userID)}: Toplamda **${val.total}** daveti var. (**${(val.regular-val.leave-val.fake) > 0 ? (val.regular-val.leave-val.fake) : 0}** regular, **${val.bonus}** bonus, **${val.fake}** fake, **${val.leave}** ayr??lan)`).splice(0, 30).join("\n");
  let invite = new MessageEmbed()
  invite.setColor("BLACK")
  invite.setAuthor(`${guildName} Invite S??ralamas?? | T??m Zamanlar`, client.guilds.cache.get(guildID).iconURL({dynamic:true}))
  invite.setFooter(`G??ncellenme: ${moment(Date.now()).locale("TR").format("LLL")}`)
  invite.setDescription(`${inviteList.length === 0 ? `Veritaban??nda kay??tl?? invite verisi yok bu y??zden bilgileri g??steremiyorum.` : inviteList}` )
  inviteMsg.edit(invite);})}
  
  function checkRegister() {    
   Database.find({ guildID: guildID }, async (err, res) => {
  res = res.filter(x => client.guilds.cache.get(guildID).members.cache.get(x.userID));
  const registerList = res.filter(x => x && x.toplamkay??t !== 0).sort((x, y) => y.toplamkay??t - x.toplamkay??t).map((val, i) =>`\`${i + 1}.\` ${client.guilds.cache.get(guildID).members.cache.get(val.userID)}: Toplamda **${val.toplamkay??t}** kay??t?? var (Erkek: **${val.erkekkay??t}**, Kad??n: **${val.k??zkay??t}**)`).splice(0, 30).join("\n");
  let reg = new MessageEmbed()
  reg.setColor("BLACK")
  reg.setAuthor(`${guildName} Kay??t S??ralamas?? | T??m Zamanlar`, client.guilds.cache.get(guildID).iconURL({dynamic:true}))
  reg.setFooter(`G??ncellenme: ${moment(Date.now()).locale("TR").format("LLL")}`)
  reg.setDescription(`${registerList.length === 0 ? `Veritaban??nda kay??tl?? kay??t verisi yok bu y??zden bilgileri g??steremiyorum.` : registerList}` )
  registerMsg.edit(reg);})}

}

module.exports.conf = {
  name: "ready",
};