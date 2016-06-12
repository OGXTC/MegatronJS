/*
========================
Libraries
========================
*/
var Discord = require("discord.js");
var request = require('request');
//var Weather = require('weather.js');

/*
========================
Includes.
========================
*/
var ConfigFile = require("./config.json");

/*
========================
Variables.
========================
*/
var bot = new Discord.Client();
var startTime = Date.now();
var admin_ids = require("./config.json").admin_ids;
var cmdPrefix = require("./config.json").command_prefix;
var aliases;
var final = "★ Sent with aspires skype tool ★";

/*
========================
Event Handlers.
========================
*/


/*
========================
Commands.
========================
*/

var commands = {
    "btc": {
        name: "btc",
        description: "BTC Value.",
        extendedhelp: "I'll tell you the current value of BTC.",
        process: function (bot, msg, suffix) {
            var request = require('request');
            request('https://api.bitfinex.com/v1/ticker/btcusd', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var btcPrice = JSON.parse(body);
                    bot.reply(msg.channel, "Here is the latest BTC price: $" + btcPrice.last_price + " per BTC.\n" + final);
                } else {

                }
            });
        }
    },
    "catfacts": {
        name: "catfacts",
        description: "Returns facts about cats!",
        extendedhelp: "I'll give you some facts about cats!",
        process: function (bot, msg, suffix) {
            var request = require('request');
            request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var catFact = JSON.parse(body);
                    bot.reply(msg.channel, catFact.facts[0] + "\n" + final);
                } else {

                }
            });
        }
    },
    "chucknorris": {
        name: "chucknorris",
        description: "Returns random chuck norris joke!",
        process: function (bot, msg, suffix) {
            var request = require('request');
            request('http://api.icndb.com/jokes/random', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var chuckJoke = JSON.parse(body);
                    bot.reply(msg.channel, chuckJoke.value.joke  + "\n" + final);
                } else {

                }
            });
        }
    },
    "info": {
        name: "info",
        description: "Tells you some of info about the bot.",
        extendedhelp: "I'll tell you some information about myself.",
        process: function (bot, msg) {
            var msgArray = [];
            msgArray.push("Hello, I'm " + bot.user.username + ", a self raping discord bot.");
            msgArray.push("I'm currently running on  version 1.Some fucking shit");
            msgArray.push("To see what I can do, use `" + ConfigFile.command_prefix + "help`");
            msgArray.push("Triggering commands is easy, I only respond to messages beginning with `" + ConfigFile.command_prefix + "` If you dont understand this drink bleach!");
            bot.sendMessage(msg.author, msgArray  + "\n" + final);
        }
    },
    "iplookup": {
        name: "iplookup",
        description: "IP Geolocate.",
        extendedhelp: "I'll be a pro hacker ip tracker bot.",
        usage: '<IP ADDRESS>',
        process: function (bot, msg, suffix) {
            var request = require('request');
            request('http://ip-api.com/json/' + suffix, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var msgArray = [];
                    var geoData = JSON.parse(body);
                    msgArray.push("Here is the data I pulled from that IP Address");
                    msgArray.push("\n```css\n");
                    msgArray.push("\n-----------------------------");
                    msgArray.push("\nIP: " + suffix);
                    msgArray.push("\nISP: " + geoData.isp);
                    msgArray.push("\nCountry: " + geoData.country);
                    msgArray.push("\nCity: " + geoData.city);
                    msgArray.push("\nRegion: " + geoData.regionName);
                    msgArray.push("\nZip: " + geoData.zip);
                    msgArray.push("\n```");
                    bot.sendMessage(msg.channel, msgArray  + "\n" + final);
                } else {
                    return;
                }
            });
        }
    },
    "johncena": {
        name: "johncena",
        description: "HIS NAME IS JOHN CENA.",
        extendedhelp: "AND HIS NAME IS JOOOOOHN CEEEENA.",
        process: function (bot, msg, suffix) {
            bot.sendMessage(msg.channel, " **AND HIS NAME IS JOHN CENA** https://www.youtube.com/watch?v=4k1xY7v8dDQ"  + "\n" + final);
        }
    },
    "ping": {
        name: "ping",
        description: "Responds pong, useful for checking if bot is alive.",
        extendedhelp: "I'll reply to you with ping, this way you can see if I'm still able to take commands.",
        process: function (bot, msg, suffix) {
            bot.sendMessage(msg.channel, " " + msg.sender + " pong!"  + "\n" + final);
            if (suffix) {
                bot.sendMessage(msg.channel, "note that !ping takes no arguments!");
            }
        }
    },
    "pirate": {
        name: "pirate",
        description: "I can make ye text more pirate mate.",
        usage: '<message to translate>',
        process: function (bot, msg, suffix) {
            var request = require('request');
            request('http://isithackday.com/arrpi.php?text=' + suffix, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var pirateOutput = body;
                    bot.reply(msg.channel, body  + "\n" + final);
                }
            });
        }
    },
    "serverinfo": {
        name: "serverinfo",
        description: "Prints the information of the current server.",
        extendedhelp: "I'll tell you some information about the server and the channel you're currently in.",
        process: function (bot, msg, suffix) {
            if (msg.channel.server) {
                var msgArray = [];
                msgArray.push("You are currently in " + msg.channel + " (id: " + msg.channel.id + ")");
                msgArray.push("on server **" + msg.channel.server.name + "** (id: " + msg.channel.server.id + ") (region: " + msg.channel.server.region + ")");
                msgArray.push("owned by " + msg.channel.server.owner + " (id: " + msg.channel.server.owner.id + ")");
                if (msg.channel.topic) {
                    msgArray.push("The current topic is: " + msg.channel.topic);
                }
                bot.sendMessage(msg, msgArray);
            } else {
                bot.sendMessage(msg, "You can't do that in a DM, dummy!.");
            }
        }
    },
    "setgame": {
        name: "setgame",
        description: "Set bots current game.",
        adminOnly: true,
        process: function (bot, msg, suffix) {
            bot.setStatus('online', suffix);
            bot.sendMessage(msg.channel, "Done! Now playing: " + suffix  + "\n" + final)
        }
    },
    "status": {
        name: "status",
        description: "Prints my stats into the chat.",
        extendedhelp: "This will print some information about myself to the channel, like uptime and currently connected users.",
        process: function (bot, msg, suffix) {
            var msgArray = [];
            msgArray.push("My uptime is " + (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.");
            msgArray.push("Currently, I'm in " + bot.servers.length + " servers, and in " + bot.channels.length + " channels.");
            msgArray.push("Currently, I'm serving " + bot.users.length + " users.");
            bot.sendMessage(msg, msgArray   + "\n" + final);
        }
    },
    "whois": {
        name: "whois",
        description: "Gets info of a user.",
        extendedhelp: "I'll get you some info about the user you've mentioned.",
        usage: '<user-mention>',
        process: function (bot, msg, suffix) {
            if (!msg.channel.server) {
                bot.sendMessage(msg.author, "I can't do that in a DM, sorry.");
                return;
            }
            if (msg.mentions.length === 0) {
                bot.sendMessage(msg.channel, "Please mention the user that you want.");
                return;
            }
            msg.mentions.map(function (user) {
                var msgArray = [];
                if (user.avatarURL === null) {
                    msgArray.push("Requested user: `" + user.username + "`");
                    msgArray.push("ID: `" + user.id + "`");
                    msgArray.push("Status: `" + user.status + "`");
                    bot.reply(msg.channel, msgArray  + "\n" + final);
                    return;
                } else {
                    msgArray.push("Requested user: `" + user.username + "`");
                    msgArray.push("ID: `" + user.id + "`");
                    msgArray.push("Status: `" + user.status + "`");
                    msgArray.push("Avatar: " + user.avatarURL);
                    bot.reply(msg.channel, msgArray  + "\n" + final);
                }
            });
        }
    },
    "yomomma": {
        name: "yomomma",
        description: "responds with a random Yo momma joke.",
        extendedhelp: "I'll roast yo momma.",
        adminOnly: false,
        process: function (bot, msg, suffix) {
            var request = require('request');
            request('http://api.yomomma.info/', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var yomomma = JSON.parse(body);
                    bot.reply(msg.channel, yomomma.joke  + "\n" + final);
                } else {

                }
            });
        }
    },
};

/*
========================
Command interpeter.
========================
*/
bot.on("message", function (msg) {
    if (msg.author == bot.user) {
        return;
    }
    if (msg.author.id != bot.user.id && (msg.content[0] === cmdPrefix)) {
        if (msg.author.equals(bot.user)) {
            return;
        }

        var cmdTxt = msg.content.split(" ")[0].substring(1).toLowerCase();
        var suffix = msg.content.substring(cmdTxt.length + 2);

        var cmd = commands[cmdTxt];
        if (cmdTxt === "help") {
            var msgArray = [];
            var commandnames = [];
            for (cmd in commands) {
                var info = cmdPrefix + cmd;
                var usage = commands[cmd].usage;
                if (usage) {
                    info += " " + usage;
                }
                var description = commands[cmd].description;
                if (description) {
                    info += "\n\t" + description;
                }
            }
            if (!suffix) {
                for (index in commands) {
                    commandnames.push(commands[index].name);
                }
                msgArray.push("Here are my commands, use `" + cmdPrefix + "help <command_name>` to get better info.");
                msgArray.push("");
                msgArray.push(commandnames.join(", "));
                bot.sendMessage(msg.author, msgArray);
                if (msg.channel.server) {
                    bot.sendMessage(msg.channel, "Ok " + msg.sender + ", I've send you a list of commands via DM.");
                }
            }
            if (suffix) {
                if (commands[suffix]) {
                    var commando = commands[suffix];
                    msgArray = [];
                    msgArray.push("**Command:** `" + commando.name + "`");
                    msgArray.push("");
                    if (commando.hasOwnProperty("usage")) {
                        msgArray.push("**Usage:** `" + ConfigFile.command_prefix + commando.name + " " + commando.usage + "`");
                    } else {
                        msgArray.push("**Usage:** `" + ConfigFile.command_prefix + commando.name + "`");
                    }
                    msgArray.push("**Description:** " + commando.extendedhelp);
                    if (commando.hasOwnProperty("adminOnly")) {
                        msgArray.push("**This command is restricted to admins.**");
                    }
                    if (commando.hasOwnProperty("timeout")) {
                        msgArray.push("**This command has a cooldown of " + commando.timeout + " seconds.**");
                    }
                    bot.sendMessage(msg.author, msgArray);
                } else {
                    bot.sendMessage(msg.channel, "There is no **" + suffix + "** command!");
                }
            }
        } else if (cmd) {
            var cmdCheckSpec = canProcessCmd(cmd, cmdTxt, msg.author.id, msg);
            if (cmdCheckSpec.isAllow) {
                cmd.process(bot, msg, suffix);
            }
        }
    }
});

function canProcessCmd(cmd, cmdText, userId, msg) {
    var isAllowResult = true;
    var errorMessage = "";

    if (cmd.hasOwnProperty("timeout")) {
        if (cmdLastExecutedTime.hasOwnProperty(cmdText)) {
            var currentDateTime = new Date();
            var lastExecutedTime = new Date(cmdLastExecutedTime[cmdText]);
            lastExecutedTime.setSeconds(lastExecutedTime.getSeconds() + cmd.timeout);

            if (currentDateTime < lastExecutedTime) {
                isAllowResult = false;
                bot.sendMessage(msg.channel, "Hey " + msg.sender + ", this command is on cooldown!");
            } else {
                cmdLastExecutedTime[cmdText] = new Date();
            }
        } else {
            cmdLastExecutedTime[cmdText] = new Date();
        }
    }

    if (cmd.hasOwnProperty("adminOnly") && cmd.adminOnly && !isAdmin(userId)) {
        isAllowResult = false;
        bot.sendMessage(msg.channel, "Hey " + msg.sender + ", you are not allowed to do that!");
    }

    return {
        isAllow: isAllowResult,
        errMsg: errorMessage
    };
}


function isAdmin(id) {
    return (admin_ids.indexOf(id) > -1);
}

function init() {
    console.log("Bot has started!")
}

bot.loginWithToken(ConfigFile.discord_token).then(init);
