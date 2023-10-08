const Discord = require('discord.js');

const client = new Discord.Client({ intents: [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildMessages,
    Discord.IntentsBitField.Flags.MessageContent,
  ]})

client.on('ready', (c) => {
    console.log('Bot is online.');
});

client.on('messageCreate', (message) => {
    if (message.content === '!cmds') {
      message.channel.send('The WORDLIST commands all begin with \'!\' and are case sensitive: [addword <word>, wordlist] addword adds a word to the wordlist, wordlist retrieves the list');
    }
  
    if (message.content === '!wordlist') {
      const wordListStr = getWordList();
      if (wordListStr.length === 0) {
        message.channel.send('wordlist is empty, please add a word')
      } else {
        message.channel.send(wordListStr);
      }
    }
  
    if (message.content.startsWith('!addword')) {
      const response = addWord(message.content) ? 'Word sucessfully added' : 'There was an error please resend word';
      message.channel.send(response);
    }
  
    if (message.content === '!clearlist') {
      wordList = [];
      message.channel.send('word list cleared');
    }

});

client.login('');  // BOT TOKEN goes in here -- mine is removed for security


//////////////////////////////////////////////////////////////////////////////////
// WORDLIST FUNCTIONS
const fs = require('fs');
const readline = require('readline');

var letters = /^[a-zA-Z]/;
var wordList = [];

function loadWordList() {
  let rl = readline.createInterface({
    input: fs.createReadStream('./word-list.txt'),
  });
  
  rl.on('line', (line) => {
    wordList.push(line.trimRight());
  });
  
  rl.on('close', () => {
    console.log('Ready!');
  });
}

function getWordList() {
  let message = '';
  wordList.forEach((word, index) => {
    if (index === wordList.length - 1) {
      message += (word.charAt(0).toUpperCase() + word.slice(1));
    } else {
      message += (word.charAt(0).toUpperCase() + word.slice(1)) + ', ';
    }
  });
  
  return message;
}
  
function addWord(command) {
  let word = getAfterCommand(command);
  if (word) {
    if (isValidWord(word)) {
      saveWord(word) 
      wordList.push(word);
      return true;
    }
  }
  
  return false;
}

function getAfterCommand(command) {
  let spaceIndex = -1;
  for (let i=0; i<command.length; i++) {
    if (command[i] === ' ') {
      spaceIndex = i;
      break;
    }
  }
  
  return spaceIndex === -1 || spaceIndex === command.length - 1 ? undefined : command.substring(spaceIndex + 1, command.length);
}
  
function saveWord(word) {
  fs.appendFileSync('./word-list.txt', word + '\n');
}
  
function isValidWord(word) {
  if (word.length <= 0) {
    return false;
  }
  
  if (!letters.test(word)) {
    return false;
  }
  
  return true;
}

client.once('ready', () => {
    loadWordList();
});
